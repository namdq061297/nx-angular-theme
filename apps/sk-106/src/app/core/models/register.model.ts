export interface Document {
  id: number;
  branch_OFFICE_ID: string | null;
  email: string;
  ref_ID: string;
  address_TYPE: string | null;
  branch_ID: string | null;
  branch_DISTRICT_ID: string | null;
  branch_PROVINCE_ID: string | null;
  receiver_TYPE: string | null;
  purpose: string | null;
  purpose_CODE: string | null;
  advise_PERSON: string;
  cif: string;
  advise_TYPE: string;
  cost_CENTER: number;
  cust_NAME: string;
  created_DATE: string;
  phone_NUMBER: string;
  is_USED_INSURRANCE: string;
  service_ID: number;
  process_STATUS: string;
  national_LOAN: string | null;
  province_LOAN: string | null;
  distric_LOAN: string | null;
  ward_LOAN: string | null;
  detail_ADDRESS_LOAN: string | null;
  resident_TYPE: string | null;
  prefer_MODE_COM: string | null;
  amount_REQUEST: string | null;
  expire: string | null;
  term: string | null;
  ranger_TIME: string | null;
  register_DATE: string | null;
  card_PROD: string | null;
  card_NETWORK: string | null;
  app_ID: string | null;
  folder_ECM_OBJECT_ID: string;
  legal_ID: string;
  product_ID: number;
  sex: string;
  legal_ID_TYPE: string;
  process_ERRORCODE: string | null;
  process_ERRORMSG: string | null;
  process_STATUS_CODE: string;
  process_TELLER: string | null;
  process_TELLER_PHONE: string | null;
  instance_ID: string | null;
  process_UPD_TIME: string | null;
  nationality: string | null;
  reg_STATUS: string | null;
  reg_ERRORCODE: string | null;
  reg_MESSAGE: string | null;
}

export interface FetchDocumentsResponse {
  code: number;
  desc: string;
  data: Document[];
}

export interface FetchDocumentsRequest {
  serviceId: number;
  custId: string;
  phoneNumber: string;
}

export enum DOCUMENT_PROCESS_STATUS {
  PENDING = 0,
  PROCESS = 1,
  REJECT = 2,
  SUCCESS = 3,
  CANCELLATION = 6,
  COMPLETION = 7,
  WAITING = 8,
  NOT_APPLICABLE = 9,
  REJECTION= 10,
  PROCESSING = 11
}