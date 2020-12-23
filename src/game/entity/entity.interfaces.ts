import { Vec3 } from '../../math/extendedMath.service';
import { MemoryTypes } from '../../process/process.interfaces';
import { WeaponEntity } from './weapon.entity';

export interface Entity {
  read: <T>(offset: number, type: MemoryTypes) => T;
  write: <T>(offset: number, value: any, type: MemoryTypes) => T;
  readBuffer: (offset: number, bytes: number) => Buffer;
}

export interface PlayerEntity extends Entity {
  index?: number;
  health: number;
  team: number;
  origin: Vec3;
  vecView: Vec3;
  punchAngles: Vec3;
  lifeState: number;
  weaponEntity?: WeaponEntity;
  crosshairId?: number;
  crosshairEntity: PlayerEntity | null;
  getBonePosition: (bone: number) => Vec3;
}
