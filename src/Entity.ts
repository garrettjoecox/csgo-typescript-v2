import type Hack from './Hack';
import OffsetHandle from './OffsetHandle';
import { MemoryType } from './ProcessHandle';

export default class Entity extends OffsetHandle {
  protected hack: Hack;

  constructor(hack: Hack, entityIndex: number) {
    const entityOffset: number = hack.clientHandle.read(
      hack.offsets.signatures.dwEntityList + 0x10 * entityIndex,
      MemoryType.dword
    );

    super(hack.processHandle, entityOffset);

    this.hack = hack;
  }

  get m_lifeState() {
    return this.read(this.hack.offsets.netvars.m_lifeState, MemoryType.int);
  }
}
