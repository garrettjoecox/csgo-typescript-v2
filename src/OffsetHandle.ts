import ProcessHandle, { MemoryType } from './ProcessHandle';

export default class OffsetHandle {
  private processHandle: ProcessHandle;

  public offset: number;

  constructor(processHandle: ProcessHandle, offset: number) {
    this.processHandle = processHandle;
    this.offset = offset;
  }

  read(offset: number, type: MemoryType) {
    if (!this.processHandle) throw new Error('No process available');

    return this.processHandle.read(this.offset + offset, type);
  }

  write(offset: number, value: any, type: MemoryType) {
    if (!this.processHandle) throw new Error('No process available');

    return this.processHandle.write(this.offset + offset, value, type);
  }
}
