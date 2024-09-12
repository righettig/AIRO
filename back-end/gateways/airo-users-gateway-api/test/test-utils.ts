import { HttpService } from "@nestjs/axios";
import { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { of } from "rxjs";

let httpService: Partial<HttpService> = {
    get: () => of(),
    post: () => of(),
};

export let HttpServiceMock = {
    provide: HttpService, useValue: httpService
}

export let createMockResponse = (data): AxiosResponse<any> => {
    return {
        data,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl', headers: {} as AxiosResponseHeaders },
        status: 200,
        statusText: 'OK',
    };
}