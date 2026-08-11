export type ContractStatus = "draft" | "active" | "expired" | "terminated";

export interface Contract {
  id: string;
  name: string;
  code: string;
  party: string;
  amount: number | null;
  status: ContractStatus;
  signDate: string;
  endDate: string;
  description?: string;
  creator: string;
  createTime: string;
}

export type ClauseType = "payment" | "confidentiality" | "breach" | "other";

export interface Clause {
  id: string;
  contractId: string;
  sequence: string;
  title: string;
  type: ClauseType;
  content: string;
  remark?: string;
  creator: string;
  createTime: string;
}
