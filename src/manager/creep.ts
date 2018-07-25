import { BodyDescriptor } from "creep/factory";
import { Manager, ManagerMemory, RegisterManager } from "manager/manager";

export const WORKGROUP_TIMEOUT = 10;

export interface WorkGroupRequest {
  id: string;
  multiplier: number;
  parts: BodyDescriptor;
  maxCreeps?: number;
}

@RegisterManager("creep")
export class CreepManager extends Manager<ManagerMemory & {
  requests: { [id: string]: Array<WorkGroupRequest & {
    time: number;
  }>}
}> {
  public run(): void {
    console.log("test");
  }
}
