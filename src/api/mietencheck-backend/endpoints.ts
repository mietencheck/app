import type { BeratungRecord } from "~/pages/beratung/types";

import { mietencheckJson } from "./client";
import type {
  LawOrgaCreateRecordResponse,
  LoginResponse,
  MietenFlowDocument,
} from "./types";

export async function postAuthLogin(body: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  return mietencheckJson<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function postLawOrgaCreateRecord(body: {
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
}): Promise<LawOrgaCreateRecordResponse> {
  return mietencheckJson<LawOrgaCreateRecordResponse>(
    "/law-and-orga-integration/createRecord",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export async function postMietenFlow(body: {
  folder_uuid: string;
  datasheet_uuid: string;
  lawAndOrgaURL: string;
  flowData: BeratungRecord;
}): Promise<string> {
  return mietencheckJson<string>("/mieten-flow", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMietenFlows(
  token: string,
): Promise<MietenFlowDocument[]> {
  return mietencheckJson<MietenFlowDocument[]>("/mieten-flow", {
    method: "GET",
    token,
  });
}
