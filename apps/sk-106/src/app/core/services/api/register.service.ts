import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { FetchDistrictsResponse } from '../../models/district.model';
import type {
  FetchDocumentsRequest,
  FetchDocumentsResponse,
  FetchOfficesRequest,
  FetchOfficesResponse,
  FetchProvincesRequest,
  FetchProvincesResponse,
} from '../../models/register.model';
import { formatQueryParams } from '../../../shared/utils.ts/string-util';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly api = inject(ApiService);

  fetchDistrict(
    provinceId: number | string,
    mockScenario?: 'success' | 'error',
  ): Observable<FetchDistrictsResponse> {
    const endpoint = mockScenario
      ? `${API_ENDPOINTS.reg.fetchDistricts}?mockScenario=${encodeURIComponent(mockScenario)}`
      : `${API_ENDPOINTS.reg.fetchDistricts}?provinceId=${encodeURIComponent(String(provinceId))}`;

    return this.api.post<FetchDistrictsResponse>(endpoint, { provinceId });
  }

  getListDocument(
    body: FetchDocumentsRequest,
    mockScenario?: 'success' | 'error',
  ): Observable<FetchDocumentsResponse> {
    const endpoint = mockScenario
      ? `${API_ENDPOINTS.reg.getListDocument}?mockScenario=${encodeURIComponent(mockScenario)}`
      : API_ENDPOINTS.reg.getListDocument;

    return this.api.post<FetchDocumentsResponse>(endpoint, body);
  }

  fetchOffices(
    body: FetchOfficesRequest,
    mockScenario?: 'success' | 'error',
  ): Observable<FetchOfficesResponse> {
    const endpoint = mockScenario
      ? `${API_ENDPOINTS.reg.fetchOffices}?mockScenario=${encodeURIComponent(mockScenario)}`
      : `${API_ENDPOINTS.reg.fetchOffices}?${formatQueryParams(body)}`;

    return this.api.post<FetchOfficesResponse>(endpoint, body);
  }

  fetchProvinces(
    body: FetchProvincesRequest,
    mockScenario?: 'success' | 'error',
  ): Observable<FetchProvincesResponse> {
    const endpoint = mockScenario
      ? `${API_ENDPOINTS.reg.fetchProvinces}?mockScenario=${encodeURIComponent(mockScenario)}`
      : `${API_ENDPOINTS.reg.fetchProvinces}?${formatQueryParams(body)}`;

    return this.api.post<FetchProvincesResponse>(endpoint, body);
  }
}
