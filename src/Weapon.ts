import Entity from './Entity';
import { MemoryType } from './ProcessHandle';

export default class Weapon extends Entity {
  get m_iClip1() {
    return this.read(this.hack.offsets.netvars.m_iClip1, MemoryType.int);
  }

  get m_fAccuracyPenalty() {
    return this.read(this.hack.offsets.netvars.m_fAccuracyPenalty, MemoryType.float);
  }

  get m_iItemDefinitionIndex() {
    return this.read(this.hack.offsets.netvars.m_iItemDefinitionIndex, MemoryType.short);
  }
}
