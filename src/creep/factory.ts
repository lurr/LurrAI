import {Priority} from "utils/priority";

export type BodyDescriptor = {
  [P in BodyPartConstant]?: number;
};

export type BodyPartPriority = {
  [P in BodyPartConstant]: Priority;
};

export const DEFAULT_PART_PRIORITY: BodyPartPriority = {
  heal: Priority.HIGHEST,
  move: Priority.HIGHER,
  attack: Priority.HIGH,
  ranged_attack: Priority.HIGH,
  work: Priority.NORMAL,
  carry: Priority.LOW,
  claim: Priority.LOWER,
  tough: Priority.LOWEST
};

export interface CreepBodyDescriptor {
  base: BodyDescriptor;
  extra?: BodyDescriptor;
  maximum?: BodyDescriptor;
}

export class CreepFactory {

  public static designCreep(energyCapacity: number, desc: CreepBodyDescriptor, prio?: BodyPartPriority) {
    const baseCost = this.getCost(desc.base);

    if (baseCost > energyCapacity)
      throw new Error(`Insufficient energy. (${baseCost} < ${energyCapacity})`);

    let out = desc.base;
    energyCapacity -= baseCost;

    let extraCost: number;
    if (desc.extra != null && (extraCost = this.getCost(desc.extra)) <= energyCapacity) {
      const n = Math.floor(energyCapacity / extraCost);
      out = _.merge(out, desc.extra, (b, e) => (b || 0) + ((e || 0) * n));
    }

    if (desc.maximum != null)
      out = _.merge(out, desc.maximum, (body, max) => Math.min(body || 0, max || 50));

    return this.sortParts(this.toArray(out), prio);
  }

  public static toArray(desc: BodyDescriptor): BodyPartConstant[] {
    return _.chain(desc)
            .map((part: BodyPartConstant, count: number) => new Array<BodyPartConstant>(count).fill(part))
            .flatten()
            .value() as BodyPartConstant[];
  }

  public static getCost(parts: BodyDescriptor): number {
    return _.chain(parts)
           .map((count: number, part: BodyPartConstant) => BODYPART_COST[part as BodyPartConstant] * count)
           .sum().value();
  }

  public static sortParts(parts: BodyPartConstant[], prio: BodyPartPriority = DEFAULT_PART_PRIORITY): BodyPartConstant[] {
    return _.sortBy(parts, c => prio[c]);
  }
}
