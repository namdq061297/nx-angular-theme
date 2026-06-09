import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { InquiryCustomerProfileResponse } from '../../models/customer-profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  inquiryCustomerProfile(): Observable<InquiryCustomerProfileResponse> {
    return this.api.post<InquiryCustomerProfileResponse>(API_ENDPOINTS.auth.inquiryCustomerProfile, {});
  }
}