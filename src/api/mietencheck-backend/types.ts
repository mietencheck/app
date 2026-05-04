import type { BeratungRecord } from "~/pages/beratung/types";

export type LawOrgaCreateRecordResponse = {
  folder_uuid: string;
  datasheet_uuid: string;
  lawAndOrgaURL: string;
};

export type MietenFlowDocument = {
  _id: string;
  folder_uuid: string;
  datasheet_uuid: string;
  lawAndOrgaURL: string;
  flowData: BeratungRecord;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginResponse = {
  access_token: string;
};
