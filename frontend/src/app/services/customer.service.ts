import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { Customer, CustomerSearchResponse } from '../models/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly apiUrl = 'http://localhost:5175/api';
  private readonly timeoutMs = 30000; // 30 seconds timeout

  constructor(private http: HttpClient) {}

  searchCustomers(query: string, limit: number = 10): Observable<CustomerSearchResponse> {
    if (!query || query.trim().length < 2) {
      // Return empty response for queries too short
      return new Observable(observer => {
        observer.next({ customers: [], totalCount: 0 });
        observer.complete();
      });
    }

    const params = new HttpParams()
      .set('query', query.trim())
      .set('limit', limit.toString());

    return this.http.get<CustomerSearchResponse>(`${this.apiUrl}/customers/search`, { params })
      .pipe(
        timeout(this.timeoutMs),
        retry({ count: 2, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check if the API is running.';
          break;
        case 400:
          errorMessage = 'Invalid search request. Please check your search terms.';
          break;
        case 404:
          errorMessage = 'Search service not found.';
          break;
        case 500:
          errorMessage = 'Server error occurred. Please try again later.';
          break;
        default:
          errorMessage = `Server returned error code ${error.status}: ${error.message}`;
      }
    }

    console.error('Customer search error:', error);
    return throwError(() => new Error(errorMessage));
  }
}