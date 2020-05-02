import {
  createResolver, gM, mT, rpm,
} from '../../shared/declerations';
import { offsets, TypesForSignatures } from '../offsets';
import { Resolver } from '../../../typings/typings';
import { Vec3 } from '../../math/extendedMath.service';

export class ClientStateService {
  public set viewAngles(angles: Vec3) {
    this.resolver().set.dwClientState_ViewAngles(angles);
  }

  public get viewAngles(): Vec3 {
    return this.privateViewAngles;
  }

    public currentMap: string = '';

    public maxEntitys: number = 0;

    public localEntityIndex: number;


    private clientStateBase;

    private resolverResult: Resolver<typeof offsets.signatures>;

    private privateViewAngles = { x: 0, y: 0, z: 0 };


    constructor() {
      this.clientStateBase = rpm(gM('engine.dll').modBaseAddr + offsets.signatures.dwClientState, mT.dword);
    }


    update() {
      const resolver = this.resolver();
      this.privateViewAngles = resolver.dwClientState_ViewAngles();
      this.currentMap = resolver.dwClientState_Map();
      this.maxEntitys = resolver.dwClientState_MaxPlayer();
      this.localEntityIndex = resolver.dwClientState_GetLocalPlayer();
    }

    private resolver(): Resolver<typeof offsets.signatures> {
      if (!this.resolverResult) {
        this.resolverResult = createResolver<typeof offsets.signatures>(this.clientStateBase, offsets.signatures, TypesForSignatures, {});
      }
      return this.resolverResult;
    }
}