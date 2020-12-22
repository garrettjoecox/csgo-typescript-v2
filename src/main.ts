import { filter } from 'rxjs/operators';
import { BaseService } from './base.service';
import { PlayerEntity } from './game/entity/entity.interfaces';
import { getOffsets } from './offsets';
import { MemoryTypes } from './process/process.interfaces';
import { Global } from './shared/declerations';

getOffsets()
  .then((offsets) => {
    const base: BaseService = new BaseService({
      webSocketService: {
        start: false,
        socketServicePort: 8080,
      },
      offsets,
    });

    base.run();

    base
      .onNewData()
      .pipe(filter((d) => d.currentEntity.lifeState === 0 && d.currentEntity.team === 3))
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
