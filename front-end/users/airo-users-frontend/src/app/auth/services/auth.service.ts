import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { ConfigService } from '../../common/services/config.service';
import { User } from '../models/user';
import { LoginResponse } from '../models/login-response';
import { SignUpResponse } from '../models/signup-response';
import { AccountType } from '../components/signup/signup.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  private userRole$ = new BehaviorSubject<string | null>(null);
  private initialized$ = new BehaviorSubject<boolean>(false);

  get apiUrl(): string {
    return `${this.configService.config.gatewayApiUrl}/gateway`;
  }

  private storageKey = 'authToken';
  private authToken?: string;

  constructor(private configService: ConfigService, private http: HttpClient) { }

  get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  get currentUserRole$(): Observable<string | null> {
    return this.userRole$.asObservable();
  }

  get isInitialized$(): Observable<boolean> {
    return this.initialized$.asObservable();
  }

  get accessToken() {
    return this.authToken;
  }

  async signup(email: string, password: string, accountType: AccountType, creditCardDetails?: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<SignUpResponse>(`${this.apiUrl}/signup`, { 
          email, password, accountType, creditCardDetails })
      );

      this._user$.next(response);

      this.authToken = response.token;
      localStorage.setItem(this.storageKey, this.authToken);
      await this.updateUserState(email);

    } catch (error) {
      console.error('Signup error', error);
      this.clearUserState();
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      );

      this._user$.next(response);

      this.authToken = response.token;
      localStorage.setItem(this.storageKey, this.authToken);
      await this.updateUserState(email);

    } catch (error) {
      console.error('Login error', error);
      this.clearUserState();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/logout`, {})
      );

      this.clearUserState();
      localStorage.removeItem(this.storageKey);

    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  initializeAuthState(): Promise<void> {
    return new Promise(async (resolve) => {
      const token = localStorage.getItem(this.storageKey);

      if (token) {
        this.authToken = token;

        const email = this.decodeEmailFromToken(token);

        if (email) {
          // Refresh token if needed
          if (this.isTokenExpiring(token)) {
            await this.refreshToken();
          }

          await this.updateUserState(email);

        } else {
          this.clearUserState();
        }

      } else {
        this.clearUserState();
      }

      this.initialized$.next(true);
      resolve();
    });
  }

  private async updateUserState(email: string): Promise<void> {
    try {
      const httpHeaders: HttpHeaders = new HttpHeaders({
        Authorization: this.accessToken!
      });

      const response = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/user`, {
          headers: httpHeaders
        })
      );

      this._user$.next(response);
      this.loggedIn$.next(true);
      
      // TODO: add userRole in /user
      //this.userRole$.next(response.role);

    } catch (error) {
      console.error('Error fetching user role:', error);
      this.clearUserState();
    }
  }

  private clearUserState(): void {
    this.authToken = undefined;

    this._user$.next(null);
    this.loggedIn$.next(false);
    this.userRole$.next(null);
  }

  private decodeEmailFromToken(token: string): string | null {
    try {
      const decodedToken = jwtDecode<{ email?: string }>(token);
      return decodedToken.email || null;

    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private isTokenExpiring(token: string): boolean {
    try {
      const decodedToken = jwtDecode<{ exp?: number }>(token);
      const expiryTime = decodedToken.exp! * 1000; // Convert to milliseconds
      const currentTime = new Date().getTime();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

      return (expiryTime - currentTime) <= bufferTime;

    } catch (error) {
      console.error('Error checking token expiry:', error);
      return false;
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, { token: this.authToken })
      );

      this.authToken = response.token;
      localStorage.setItem(this.storageKey, this.authToken);

    } catch (error) {
      console.error('Token refresh error:', error);

      this.clearUserState();
      localStorage.removeItem(this.storageKey);
      window.location.reload();
    }
  }
}
