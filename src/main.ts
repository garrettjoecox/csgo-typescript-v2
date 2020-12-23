import * as iohook from 'iohook';
import { filter } from 'rxjs/operators';
import { BaseService } from './base.service';
import { PlayerEntity } from './game/entity/entity.interfaces';
import { getOffsets } from './offsets';
import { MemoryTypes } from './process/process.interfaces';
import { Global } from './shared/declerations';
import { weapons } from './weapons';

const keyPressedMap: { [key: number]: boolean } = {};
const isKeyPressed = (key: number): boolean => !!keyPressedMap[key];
iohook.on('mousedown', ({ button }: { button: number }) => {
  keyPressedMap[button] = true;
});
iohook.on('mouseup', ({ button }: { button: number }) => {
  keyPressedMap[button] = false;
});
iohook.on('keydown', ({ keycode }: { keycode: number }) => {
  keyPressedMap[keycode] = true;
});
iohook.on('keyup', ({ keycode }: { keycode: number }) => {
  keyPressedMap[keycode] = false;
});
iohook.start();

getOffsets()
  .then((offsets) => {
    const base: BaseService = new BaseService({
      offsets,
    });

    base.run();

    // BHOP
    base
      .onNewData()
      .pipe(filter(() => isKeyPressed(57)))
      .subscribe((data) => {
        const playerJumpState = data.localEntity.read(offsets.netvars.m_fFlags, MemoryTypes.int);

        if (playerJumpState === 257) {
          Global.player.jump();
        }
      });

    // Triggerbot
    base
      .onNewData()
      .pipe(filter((d) => isKeyPressed(56) && !!d.localEntity.crosshairEntity))
      .subscribe((data) => {
        const currentPenalty =
          // @ts-ignore
          data.localEntity.weaponEntity.weaponEntityBase.m_fAccuracyPenalty(MemoryTypes.float) * 1000;
        const weaponConfig = weapons.find((w) => w.name === data.localEntity.weaponEntity.name);
        if (data.localEntity.team !== data.localEntity.crosshairEntity.team) {
          if (weaponConfig) {
            const basePenalty = weaponConfig.inaccuracyAlt;
            if (currentPenalty <= basePenalty * 1.1) {
              data.player.attack();
              setTimeout(() => {
                data.player.attack();
              }, 100);
            } else if (currentPenalty < basePenalty * 1.5) {
              data.player.attack();
            }
          } else {
            data.player.attack();
          }
        }
      });

    // Radar
    base
      .onNewData()
      .pipe(
        filter((d) => isKeyPressed(5) && d.currentEntity.lifeState === 0 && d.currentEntity.team !== d.localEntity.team)
      )
      .subscribe((data) => {
        const entity: PlayerEntity = data.currentEntity;
        entity.write(offsets.netvars.m_bSpotted, 1, MemoryTypes.int);
      });

    // Glow
    base
      .onNewData()
      .pipe(
        filter((d) => isKeyPressed(5) && d.currentEntity.lifeState === 0 && d.currentEntity.team !== d.localEntity.team)
      )
      .subscribe((data) => {
        const entity: PlayerEntity = data.currentEntity;
        const glowIndex: number = entity.read(offsets.netvars.m_iGlowIndex, MemoryTypes.uint32);
        const glowManager: number = Global.rpm(
          Global.gM('client.dll').modBaseAddr + offsets.signatures.dwGlowObjectManager,
          MemoryTypes.uint32
        );
        Global.wpm(glowManager + glowIndex * 0x38 + 0x4, 0, MemoryTypes.float);
        Global.wpm(glowManager + glowIndex * 0x38 + 0x8, 1, MemoryTypes.float);
        Global.wpm(glowManager + glowIndex * 0x38 + 0xc, 0, MemoryTypes.float);
        Global.wpm(glowManager + glowIndex * 0x38 + 0x10, 1, MemoryTypes.float);
        Global.wpm(glowManager + glowIndex * 0x38 + 0x24, true, MemoryTypes.bool);
        Global.wpm(glowManager + glowIndex * 0x38 + 0x25, false, MemoryTypes.bool);
      });
  })
  .catch((e) => {
    console.error(e);
  });
