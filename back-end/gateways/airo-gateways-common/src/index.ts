import { HttpService } from "@nestjs/axios";
import { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { of } from "rxjs";

let httpService: Partial<HttpService> = {
    get: () => of(),
    post: () => of(),
    patch: () => of(),
    put: () => of(),
    delete: () => of(),
};

export let createMockHttpService = (service: any) => {
    return { provide: service, useValue: httpService }
}

export let createMockResponse = (data: any): AxiosResponse<any> => {
    return {
        data,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl', headers: {} as AxiosResponseHeaders },
        status: 200,
        statusText: 'OK',
    };
}