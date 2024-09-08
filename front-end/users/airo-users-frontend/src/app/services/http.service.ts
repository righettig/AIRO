import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private authService: AuthService) { }

  async fetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    // Get the token from your AuthService
    const token = this.authService.accessToken;

    // Create or clone the headers object
    const headers = new Headers(init?.headers || {});
    headers.set('Authorization', `${token}`);
    headers.set('Content-Type', 'application/json');

    // Create the modified fetch options
    const modifiedInit: RequestInit = {
      ...init,
      headers,
    };

    // Perform the fetch with the modified options
    const response = await fetch(input, modifiedInit);

    // Ensure the response is in the expected format
    const data = await response.json();

    return data as T;
  }

  async get<T>(url: string): Promise<T> {
    return this.fetch<T>(url, {
      method: 'GET',
    });
  }
}
