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

export interface Office {
  branch_ID: number;
  costcenter: number;
  office_NAME: string;
  crm_CREDIT_STATUS: string;
  crm_INSURANCE_STATUS: string;
  crm_DEBIT_STATUS: string;
  crm_LOAN_STATUS: string;
  debit_STATUS: string;
  insurance_STATUS: string;
  loan_STATUS: string;
  available_STATUS: string;
  office_ID: number;
  last_UPDATE_DATE: string;
  address: string;
  office_NAME_EN: string;
  address_EN: string;
  credit_STATUS: string;
  district_ID: number;
  rlos_STATUS: string;
  latitude: string;
  longitude: string;
  slots: string;
  status: number;
}

export interface FetchDocumentsResponse {
  code: number;
  desc: string;
  data: Document[];
}

export interface FetchOfficesResponse {
  code: number;
  desc: string;
  data: Office[];
}

export interface FetchDocumentsRequest {
  serviceId: number;
  custId: string | number;
  phoneNumber: string;
}

export interface FetchOfficesRequest {
  districtID: string | number;
  type: string | number;
  customerType: string | number;
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
  REJECTION = 10,
  PROCESSING = 11,
}

export interface FetchProvincesRequest {
  type: string | number;
  customType: string | number;
}

export interface Province {
  province_NAME: string;
  pcode: string;
  province_NAME_EN: string;
  province_ID: number;
}

export interface FetchProvincesResponse {
  code: number;
  desc: string;
  data: Province[];
}
