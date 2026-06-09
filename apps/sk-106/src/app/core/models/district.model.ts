export interface District {
  district_ID: number;
  district_NAME: string;
  province_ID: number;
  district_NAME_EN: string | null;
}

export interface FetchDistrictsResponse {
  code: number;
  desc: string;
  data: District[];
}