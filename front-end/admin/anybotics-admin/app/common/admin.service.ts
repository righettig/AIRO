import { createApiService } from './api.service';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL!;

const adminService = createApiService(ADMIN_API_URL);

export const fetchUsers = () => 
    adminService.request('list', 'GET');

export const deleteUser = (uid: string) => 
    adminService.request(`delete/${uid}`, 'DELETE');
