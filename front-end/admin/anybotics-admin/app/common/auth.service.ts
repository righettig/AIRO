import { createApiService } from './api.service';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL!;

const authService = createApiService(AUTH_API_URL);

export const login = (email: string, password: string) => 
    authService.request('login', 'POST', { email, password });

export const logout = () => 
    authService.request('logout', 'POST');

export const refreshToken = () => 
    authService.request('refresh-token', 'POST');
