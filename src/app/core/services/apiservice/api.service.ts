import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private configUrl = 'assets/app-config.json';
  apiUrl: string = '';

  constructor() {
    this.loadUrl();
  }
  getConfig(): Observable<any> {
    return this.http.get<any>(this.configUrl);
  }

  private loadUrl(): void {
    this.getConfig().subscribe(
      (config) => {
        this.apiUrl = config.apiUrl;
      },
      (error) => {
        console.error('Failed to load configuration:', error);
      }
    );
  }
  post(endpoint: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(
        `${this.apiUrl}${endpoint}`,
        data,
        { headers, withCredentials: true } // Ensure credentials (cookies) are sent
      )
      .pipe(catchError(this.handleError));
  }

  Get(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .get<any>(`${this.apiUrl}${endpoint}`, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let message = '';
    if (error.error instanceof ErrorEvent) {
      message = `Client Error: ${error.error.message}`;
    } else {
      message = `Server Error: ${error.status} - ${error.message}`;
    }
    console.error('API Error:', message);
    return throwError(() => new Error(message));
  }
}
