import { EventEmitter } from 'events';
import * as memory from 'memoryjs';
import Runnable from './Runnable';

export enum MemoryType {
  byte = 'byte',
  int = 'int',
  int32 = 'int32',
  uint32 = 'uint32',
  int64 = 'int64',
  uint64 = 'uint64',
  dword = 'dword',
  short = 'short',
  long = 'long',
  float = 'float',
  double = 'double',
  bool = 'bool',
  boolean = 'boolean',
  ptr = 'ptr',
  pointer = 'pointer',
  str = 'str',
  string = 'string',
  vec3 = 'vec3',
  vector3 = 'vector3',
  vec4 = 'vec4',
  vector4 = 'vector4',
}

export default class ProcessHandle extends Runnable {
  private processName: string;

  private process?: {
    th32ProcessID: number;

    modBaseAddr: number;

    handle: number;
  };

  private modules: { [moduleName: string]: number } = {};

  public processState: 'detached' | 'attached' = 'detached';

  private events: EventEmitter = new EventEmitter();

  constructor(processName: string) {
    super();
    this.processName = processName;
  }

  start() {
    super.start();

    this.events.emit('start');
  }

  tick() {
    if (this.process) {
      try {
        memory.findModule('engine.dll', this.process.th32ProcessID);
      } catch (error) {
        this.process = undefined;
        this.processState = 'detached';
        this.events.emit('detach');
      }
    } else {
      try {
        this.process = memory.openProcess(this.processName);
        this.processState = 'attached';
        this.events.emit('attach');
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }

    super.tick();
  }

  stop() {
    this.events.emit('stop');

    super.stop();
  }

  read(offset: number, type: MemoryType) {
    if (!this.process) throw new Error('No process available');

    return memory.readMemory(this.process.handle, offset, type);
  }

  write(offset: number, value: any, type: MemoryType) {
    if (!this.process) throw new Error('No process available');

    return memory.writeMemory(this.process.handle, offset, value, type);
  }

  getModule(moduleName: string) {
    if (!this.process) throw new Error('No process available');

    if (!this.modules[moduleName]) {
      this.modules[moduleName] = memory.findModule(moduleName, this.process.th32ProcessID).modBaseAddr;
    }

    return this.modules[moduleName];
  }

  on(event: 'stop' | 'start' | 'attach' | 'detach', listener: () => void) {
    this.events.on(event, listener);
  }
}
