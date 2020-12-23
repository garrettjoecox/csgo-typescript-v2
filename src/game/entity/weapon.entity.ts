import { MiscEntityResolver } from '../../base.interfaces';
import { WeaponIndex } from '../../shared/declerations';

export class WeaponEntity {
  set id(id: number) {
    console.log(`Weapon Entity ID is not setable! | ${id}`);
  }

  get id() {
    return this.idResolver();
  }

  set name(name: string) {
    console.log(`Weapon Entity name is not setable! | ${name}`);
  }

  get name() {
    return this.nameResolver();
  }

  public base: number;

  constructor(private weaponEntityBase: MiscEntityResolver) {
    this.base = weaponEntityBase.base;
  }

  idResolver = () => this.weaponEntityBase.m_iItemDefinitionIndex();

  nameResolver() {
    const weaponKeys = this.getWeaponKeys();
    if (WeaponIndex[this.id]) {
      const currentKey = Object.keys(WeaponIndex).indexOf(`${this.id}`);
      if (currentKey !== undefined && weaponKeys[currentKey]) {
        return weaponKeys[currentKey].replace('WEAPON_', '').replace(/_/g, ' ').toLowerCase();
      }
      return 'unknown weapon';
    }
    return 'unknown weapon';
  }

  private getWeaponKeys(): string[] {
    return Object.keys(WeaponIndex).reduce((arr, key) => {
      if (!arr.includes(key)) {
        arr.push(WeaponIndex[key]);
      }
      return arr;
    }, []);
  }
}
