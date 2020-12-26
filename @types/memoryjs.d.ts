declare module 'memoryjs' {
  type Process = {
    szExeFile: string;
    th32ProcessID: number;
    modBaseAddr: number;
    handle: number;
  };
  type Module = {
    modBaseAddr: number;
  };
  type MemoryType =
    | 'byte'
    | 'int'
    | 'int32'
    | 'uint32'
    | 'int64'
    | 'uint64'
    | 'dword'
    | 'short'
    | 'long'
    | 'float'
    | 'double'
    | 'bool'
    | 'boolean'
    | 'ptr'
    | 'pointer'
    | 'str'
    | 'string'
    | 'vec3'
    | 'vector3'
    | 'vec4'
    | 'vector4';

  export function getProcesses(): Process[];
  export function openProcess(processName: string): Process;
  export function findModule(moduleName: string, processId: number): Module;

  export function readMemory(handle: number, address: number, type: MemoryType);
  export function writeMemory(handle: number, address: number, value: any, type: MemoryType);
  export function readBuffer(handle: number, address: number, size: number);
  export function writeBuffer(handle: number, address: number, buffer: any);
}
