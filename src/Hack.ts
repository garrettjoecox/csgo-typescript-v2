import * as aks from 'asynckeystate';
import { throttle } from 'lodash';
import { getActiveProcessName } from 'windows-active-process';
import OffsetHandle from './OffsetHandle';
import { Offsets } from './offsets';
import Player from './Player';
import ProcessHandle, { MemoryType } from './ProcessHandle';
import Runnable from './Runnable';
import Weapon from './Weapon';
import { weapons } from './weapons';

export default class Hack extends Runnable {
  public offsets: Offsets;

  public config: {};

  public processHandle: ProcessHandle;

  public clientHandle?: OffsetHandle;

  public engineHandle?: OffsetHandle;

  public clientStateHandle?: OffsetHandle;

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

  getPlayers = () => {
    const players: {
      enemy: Player[];
      friendly: Player[];
    } = {
      enemy: [],
      friendly: [],
    };

    const selfIndex = this.clientStateHandle.read(this.offsets.signatures.dwClientState_GetLocalPlayer, MemoryType.int);
    const maxEntity = this.clientStateHandle.read(this.offsets.signatures.dwClientState_MaxPlayer, MemoryType.int);
    const self = new Player(this, selfIndex);
    for (let entityIndex = 0; entityIndex < maxEntity; entityIndex += 1) {
      const entity = new Player(this, entityIndex);
      if (entityIndex === selfIndex) continue;

      if (entity.m_lifeState === 0 && entity.m_bDormant === 0 && entity.m_iHealth > 0) {
        if (entity.m_iTeamNum === self.m_iTeamNum) {
          players.friendly.push(entity);
        } else {
          players.enemy.push(entity);
        }
      }
    }

    return players;
  };

  getSelf = () => {
    const selfIndex = this.clientStateHandle.read(this.offsets.signatures.dwClientState_GetLocalPlayer, MemoryType.int);

    return new Player(this, selfIndex);
  };

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
    if (this.processHandle.processState !== 'attached' || getActiveProcessName()?.split('\\').pop() !== 'csgo.exe') {
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
      const glowIndex = player.m_iGlowIndex;

      this.processHandle.write(glowManager + glowIndex * 0x38 + 0x4, 1 - player.m_iHealth / 100, MemoryType.float);
      this.processHandle.write(glowManager + glowIndex * 0x38 + 0x8, 0 + player.m_iHealth / 100, MemoryType.float);
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
  }, 500);

  triggerbot = throttle(() => {
    const self = this.getSelf();
    const crosshairEntity = new Player(this, self.m_iCrosshairId);

    if (crosshairEntity.m_lifeState === 0 && crosshairEntity.m_iTeamNum === 3 && crosshairEntity.m_iHealth > 0) {
      const weapon = new Weapon(this, self.m_hActiveWeapon);
      const currentPenalty = weapon.m_fAccuracyPenalty;
      const weaponId = weapon.m_iItemDefinitionIndex;

      if (weapon.m_iClip1 < 1) return;

      if (weapons[weaponId]) {
        const basePenalty = weapons[weaponId].inaccuracyAlt;
        if (currentPenalty <= basePenalty * 1.2) {
          this.attack();
          setTimeout(() => this.attack(), 100);
        } else if (currentPenalty <= basePenalty * 1.5) {
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

    const weapon = new Weapon(this, self.m_hActiveWeapon);

    if (playerFlag !== 0 && weapon.m_iClip1 === -1) {
      this.jump();
    }
  }, 0);
}
