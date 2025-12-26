export type BranchRecord = {
  id: number;
  name: string;
  summary: string;
  sortOrder: number;
};

export type ToolRecord = {
  id: number;
  branchId: number | null;
  title: string;
  description: string;
  previewUrl: string | null;
  videoUrl: string | null;
  status: "Aktiv" | "In Prüfung" | "Entwurf";
  sortOrder: number;
  tags?: string[];
};

export type ContactRecord = {
  id: number;
  label: string;
  value: string;
  kind: "email" | "phone" | "link";
  sortOrder: number;
};

export type CustomerRecord = {
  id: number;
  name: string;
  contactEmail: string | null;
  contactPhone: string | null;
};

export type ToolCustomerRecord = {
  id: number;
  toolId: number;
  customerId: number;
};

export type ContentResponse = {
  branches: BranchRecord[];
  tools: ToolRecord[];
  contacts: ContactRecord[];
  customers: CustomerRecord[];
  toolsCustomers: ToolCustomerRecord[];
};
