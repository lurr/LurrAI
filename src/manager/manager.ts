export interface ManagerMemory {}

declare global {
  interface Memory {
    managers: Record<string, ManagerMemory>;
  }
}

export const managers: Record<string, Manager> = {};
export const cachedManagers: Record<string, Manager> = {};

export abstract class Manager<T extends ManagerMemory = ManagerMemory> {
  public readonly type: string;

  constructor() {
    this.type = Object.getPrototypeOf(this).constructor.type;
  }

  protected get memory(): T {
    return Memory.managers[this.type] as T;
  }

  public abstract run(): void;
}

export interface ManagerConstructor {
  new(): Manager<ManagerMemory>;
  type?: string;
}

export function RegisterManager(name: string) {
  return (ctor: ManagerConstructor) => {
    ctor.type = name;
    managers[name] = new ctor();
  };
}

export function runManagers() {
  for (const manager in managers)
    managers[manager].run();
}
