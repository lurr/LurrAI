import { TaskStatus } from "creep/tasks";

declare global {
  interface CreepMemory {
    ti: number;
  }
}

export class WorkUnit {
  public constructor(public workers: Creep[]) {}

  public get count(): number {
    return this.workers.length;
  }

  public run(...tasks: Task[]) {
    if (tasks.length === 0) return;

    for (const creep of this.workers) {
      if (creep.spawning) continue;
      if (creep.memory.ti == null || creep.memory.ti < 0 || creep.memory.ti > tasks.length - 1)
        creep.memory.ti = 0;

      const status = tasks[creep.memory.ti].apply(creep);
      if (status === TaskStatus.COMPLETED)
        creep.memory.ti++;
    }
  }
}
