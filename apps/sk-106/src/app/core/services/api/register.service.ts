import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { FetchDistrictsResponse } from '../../models/district.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly api = inject(ApiService);

  fetchDistricts(provinceId: number, mockScenario?: 'success' | 'error'): Observable<FetchDistrictsResponse> {
    const endpoint = mockScenario
      ? `${API_ENDPOINTS.reg.fetchDistricts}?mockScenario=${encodeURIComponent(mockScenario)}`
      : API_ENDPOINTS.reg.fetchDistricts;

    return this.api.post<FetchDistrictsResponse>(endpoint, { provinceId });
  }
}