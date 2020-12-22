import * as rxjs from 'rxjs';
import { AfterEntityLoopData, BaseGameData, GameData, HackConfig } from './base.interfaces';
import { ClientStateService } from './game/clientState/clientState.service';
import { EntityBase } from './game/entity/entity.service';
import { Player } from './game/player/player';
import { RendererService } from './game/renderer/renderer.service';
import { ProcessService } from './process/process.service';
import { Global } from './shared/declerations';

export let proc: ProcessService;

export class BaseService {
  private newDataSubject: rxjs.Subject<GameData> = new rxjs.Subject<GameData>();

  private afterEntityLoopSubject: rxjs.Subject<AfterEntityLoopData> = new rxjs.Subject<AfterEntityLoopData>();

  constructor(public config: HackConfig = {}) {
    console.log('base service init');
  }

  run() {
    this.doRun();
  }

  public onNewData(): rxjs.Subject<GameData> {
    return this.newDataSubject;
  }

  public afterEntityLoop(): rxjs.Subject<AfterEntityLoopData> {
    return this.afterEntityLoopSubject;
  }

  private getBaseReply = (): BaseGameData => ({
    clientState: Global.clientState,
    baseIsRunning: true,
    entityBase: Global.entityBase,
    localEntity: Global.entityBase.entity(Global.clientState.localEntityIndex),
    player: Global.player,
    offsets: this.config.offsets,
    getModuleBase: (moduleName: string) => Global.gM(moduleName).modBaseAddr,
    readMemory: Global.rpm,
  });

  private declareGlobal(processService: ProcessService) {
    Global.gM = processService.getModule.bind(proc);
    Global.rpm = processService.readMemory.bind(proc);
    Global.rbf = processService.readBuffer.bind(proc);
    Global.wpm = processService.writeMemory.bind(proc);
    Global.wbf = processService.writeBuffer.bind(proc);

    Global.clientState = new ClientStateService(this.config.offsets);
    Global.entityBase = new EntityBase(this.config.offsets);
    Global.renderer = new RendererService(this.config.offsets);
    Global.player = new Player(this.config.offsets);
  }

  private doRun() {
    proc = new ProcessService('csgo.exe');
    this.declareGlobal(proc);
    console.log('hack initialized..\nstarting main loop..');

    const update = () => {
      Global.clientState.update();
      Global.entityBase.update(Global.clientState.localEntityIndex);
      Global.renderer.readViewMatrix();
    };

    update();
    const main = rxjs.interval(0);

    main.subscribe(() => {
      const loaded = [];
      for (let i = 0; i < Global.clientState.maxEntitys; i += 3) {
        if (!loaded.includes(i)) {
          loaded.push(i);
          this.sendNewPlayerDataByIndex(i);
        }
        if (!loaded.includes(i + 1) && i + 1 < Global.clientState.maxEntitys) {
          this.sendNewPlayerDataByIndex(i + 1);
          loaded.push(i + 1);
        }
        if (!loaded.includes(i + 2) && i + 2 < Global.clientState.maxEntitys) {
          this.sendNewPlayerDataByIndex(i + 2);
          loaded.push(i + 2);
        }
      }

      update();
      // on update
      this.afterEntityLoopSubject.next({
        ...this.getBaseReply(),
        localEntity: Global.entityBase.entity(Global.clientState.localEntityIndex),
        player: Global.player,
      });
    });
  }

  private sendNewPlayerDataByIndex(i: number) {
    Global.entityBase.update(i);
    const entity = Global.entityBase.entity(i);
    if (entity && entity.lifeState === 0) {
      if (entity.team === 2 || entity.team === 3) {
        this.newDataSubject.next({
          ...this.getBaseReply(),
          currentEntity: entity,
          localEntity: Global.entityBase.entity(Global.clientState.localEntityIndex),
          currentEntityIndex: i,
          player: Global.player,
        });
      }
    }
  }
}
