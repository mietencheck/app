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
  /** New rows: {@link BeratungRecord}. Legacy: questionnaire answer map. */
  flowData: BeratungRecord | Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginResponse = {
  access_token: string;
};
