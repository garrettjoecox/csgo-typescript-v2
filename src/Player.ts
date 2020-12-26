import Entity from './Entity';
import { MemoryType } from './ProcessHandle';

export default class Player extends Entity {
  get m_iTeamNum() {
    return this.read(this.hack.offsets.netvars.m_iTeamNum, MemoryType.int);
  }

  get m_bDormant() {
    return this.read(this.hack.offsets.signatures.m_bDormant, MemoryType.dword);
  }

  get m_iHealth() {
    return this.read(this.hack.offsets.netvars.m_iHealth, MemoryType.int);
  }

  get m_hActiveWeapon() {
    // eslint-disable-next-line no-bitwise
    return (this.read(this.hack.offsets.netvars.m_hActiveWeapon, MemoryType.int) - 1) & 65535;
  }

  get m_iCrosshairId() {
    return this.read(this.hack.offsets.netvars.m_iCrosshairId, MemoryType.int) - 1;
  }

  get m_iGlowIndex() {
    return this.read(this.hack.offsets.netvars.m_iGlowIndex, MemoryType.int);
  }
}
