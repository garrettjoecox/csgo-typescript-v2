import * as aks from 'asynckeystate';
import { memoize, throttle } from 'lodash';
import OffsetHandle from './OffsetHandle';
import { Offsets } from './offsets';
import ProcessHandle, { MemoryType } from './ProcessHandle';
import Runnable from './Runnable';
import { weapons } from './weapons';

export default class Hack extends Runnable {
  private offsets: Offsets;

  private config: {};

  private processHandle: ProcessHandle;

  private clientHandle?: OffsetHandle;

  private engineHandle?: OffsetHandle;

  private clientStateHandle?: OffsetHandle;

  protected tickRate: number = 0;

  constructor(options: { offsets: Offsets; config?: {}; processHandle?: ProcessHandle }) {
    super();
    this.offsets = options.offsets;
    this.config = options.config || {};
    this.processHandle = options.processHandle || new ProcessHandle('csgo.exe');
    this.processHandle.on('attach', () => {
      console.log('Attached to process');
      this.clientHandle = new OffsetHandle(this.processHandle, this.processHandle.getModule('client.dll'));
      this.engineHandle = new OffsetHandle(this.processHandle, this.processHandle.getModule('engine.dll'));
      this.clientStateHandle = new OffsetHandle(
        this.processHandle,
        this.engineHandle.read(this.offsets.signatures.dwClientState, MemoryType.dword)
      );
    });
    this.processHandle.on('detach', () => {
      console.log('Detached from process');
      this.clientHandle = undefined;
      this.engineHandle = undefined;
      this.clientStateHandle = undefined;
    });
  }

  start() {
    this.processHandle.start();

    super.start();
  }

  getPlayersInternal = () => {
    setTimeout(() => {
      this.getPlayers.cache.clear();
    }, 5000);

    const players: {
      enemy: OffsetHandle[];
      friendly: OffsetHandle[];
    } = {
      enemy: [],
      friendly: [],
    };

    const selfIndex = this.clientStateHandle.read(this.offsets.signatures.dwClientState_GetLocalPlayer, MemoryType.int);
    const maxEntity = this.clientStateHandle.read(this.offsets.signatures.dwClientState_MaxPlayer, MemoryType.int);
    for (let i = 0; i < maxEntity; i += 1) {
      const dwEntity: number = this.clientHandle.read(
        this.offsets.signatures.dwEntityList + 0x10 * i,
        MemoryType.dword
      );
      const entity = new OffsetHandle(this.processHandle, dwEntity);
      if (i === selfIndex) continue;

      const lifeState = entity.read(this.offsets.netvars.m_lifeState, MemoryType.int);
      const team = entity.read(this.offsets.netvars.m_iTeamNum, MemoryType.int);
      const dormant = entity.read(this.offsets.signatures.m_bDormant, MemoryType.dword);
      const health = entity.read(this.offsets.netvars.m_iHealth, MemoryType.int);

      if (lifeState === 0 && dormant === 0 && health > 0) {
        if (team === 2) {
          players.friendly.push(entity);
        } else if (team === 3) {
          players.enemy.push(entity);
        }
      }
    }

    return players;
  };

  getPlayers = memoize(this.getPlayersInternal);

  getSelfInternal = () => {
    setTimeout(() => {
      this.getSelf.cache.clear();
    }, 5000);

    const selfIndex = this.clientStateHandle.read(this.offsets.signatures.dwClientState_GetLocalPlayer, MemoryType.int);
    const dwEntity: number = this.clientHandle.read(
      this.offsets.signatures.dwEntityList + 0x10 * selfIndex,
      MemoryType.dword
    );

    return new OffsetHandle(this.processHandle, dwEntity);
  };

  getSelf = memoize(this.getSelfInternal);

  attack = throttle(() => {
    this.clientHandle.write(this.offsets.signatures.dwForceAttack, 5, MemoryType.int);
    setTimeout(() => {
      this.clientHandle.write(this.offsets.signatures.dwForceAttack, 4, MemoryType.int);
    }, 10);
  }, 20);

  jump = throttle(() => {
    this.clientHandle.write(this.offsets.signatures.dwForceJump, 6, MemoryType.int);
  }, 100);

  tick() {
    if (this.processHandle.processState !== 'attached') {
      super.tick();
      return;
    }

    this.radar();

    // Mouse key 4
    if (aks.getAsyncKeyState(0x06)) {
      this.glow();
    }

    // Alt
    if (aks.getAsyncKeyState(0x12)) {
      this.triggerbot();
    }

    // Space
    if (aks.getAsyncKeyState(0x20)) {
      this.bhop();
    }

    super.tick();
  }

  glow = throttle(() => {
    const players = this.getPlayers();

    const glowManager = this.clientHandle.read(this.offsets.signatures.dwGlowObjectManager, MemoryType.int);
    players.enemy.forEach((player) => {
      const glowIndex = player.read(this.offsets.netvars.m_iGlowIndex, MemoryType.int);

      this.processHandle.write(glowManager + glowIndex * 0x38 + 0x4, 0, MemoryType.float);
      this.processHandle.write(glowManager + glowIndex * 0x38 + 0x8, 1, MemoryType.float);
      this.processHandle.write(glowManager + glowIndex * 0x38 + 0xc, 0, MemoryType.float);
      this.processHandle.write(glowManager + glowIndex * 0x38 + 0x10, 1, MemoryType.float);
      this.processHandle.write(glowManager + glowIndex * 0x38 + 0x24, true, MemoryType.bool);
      this.processHandle.write(glowManager + glowIndex * 0x38 + 0x25, false, MemoryType.bool);
    });
  }, 20);

  radar = throttle(() => {
    const players = this.getPlayers();

    players.enemy.forEach((player) => {
      player.write(this.offsets.netvars.m_bSpotted, 1, MemoryType.int);
    });
  }, 1000);

  triggerbot = throttle(() => {
    const self = this.getSelf();
    const crosshairEntityId = self.read(this.offsets.netvars.m_iCrosshairId, MemoryType.int);
    const maxEntity = this.clientStateHandle.read(this.offsets.signatures.dwClientState_MaxPlayer, MemoryType.int);
    if (!crosshairEntityId || crosshairEntityId > maxEntity) return;

    const dwEntity: number = this.clientHandle.read(
      this.offsets.signatures.dwEntityList + 0x10 * (crosshairEntityId - 1),
      MemoryType.dword
    );
    const crosshairEntity = new OffsetHandle(this.processHandle, dwEntity);
    const lifeState = crosshairEntity.read(this.offsets.netvars.m_lifeState, MemoryType.int);
    const team = crosshairEntity.read(this.offsets.netvars.m_iTeamNum, MemoryType.int);
    const health = crosshairEntity.read(this.offsets.netvars.m_iHealth, MemoryType.int);

    if (lifeState === 0 && team === 3 && health > 0) {
      // eslint-disable-next-line no-bitwise
      const weaponIndex = (self.read(this.offsets.netvars.m_hActiveWeapon, MemoryType.int) - 1) & 65535;
      const weaponOffset = this.clientHandle.read(
        this.offsets.signatures.dwEntityList + 0x10 * weaponIndex,
        MemoryType.int
      );
      const weapon = new OffsetHandle(this.processHandle, weaponOffset);
      const clip = weapon.read(this.offsets.netvars.m_iClip1, MemoryType.int);
      const currentPenalty = weapon.read(this.offsets.netvars.m_fAccuracyPenalty, MemoryType.float) * 1000;
      const weaponId = weapon.read(this.offsets.netvars.m_iItemDefinitionIndex, MemoryType.short);

      if (clip < 1) return;

      if (weapons[weaponId]) {
        const basePenalty = weapons[weaponId].inaccuracyAlt;
        if (currentPenalty <= basePenalty * 1.7) {
          this.attack();
        }
      } else {
        this.attack();
      }
    }
  }, 0);

  bhop = throttle(() => {
    const self = this.getSelf();
    // eslint-disable-next-line no-bitwise
    const playerFlag = self.read(this.offsets.netvars.m_fFlags, MemoryType.int) & 1;
    // eslint-disable-next-line no-bitwise
    const weaponIndex = (self.read(this.offsets.netvars.m_hActiveWeapon, MemoryType.int) - 1) & 65535;
    const weaponOffset = this.clientHandle.read(
      this.offsets.signatures.dwEntityList + 0x10 * weaponIndex,
      MemoryType.int
    );
    const weapon = new OffsetHandle(this.processHandle, weaponOffset);
    const weaponId = weapon.read(this.offsets.netvars.m_iItemDefinitionIndex, MemoryType.short);

    if (playerFlag !== 0 && weaponId === 42) {
      this.jump();
    }
  }, 0);
}
