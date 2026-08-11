export type DeviceStatus = "online" | "offline" | "alarm";

export interface Device {
  id: string;
  name: string;
  sn: string;
  firmware: string;
  groupId: string;
  status: DeviceStatus;
  accessTime: string;
  remark?: string;
}

// Tree node definition matching FilterBarTreeEdit's FilterBarTreeNodeType
export interface DeviceGroup {
  id: string;
  name: string;
  children?: DeviceGroup[];
}
