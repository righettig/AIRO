import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type ValidateResult = { success: boolean; errors: string[] };
export type CompileResult = { message: string, blobUri: string };

@Injectable()
export class BotBehaviourCompilerService {
    private readonly serviceUrl = process.env.BOT_BEHAVIOUR_COMPILER_API_URL!;

    constructor(private readonly httpService: HttpService) { }

    async compile(behaviourId: string, code: string): Promise<CompileResult> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/api/bot-behaviors/${behaviourId}/compile`, {
                botBehaviourId: behaviourId,
                botBehaviourScript: code
            }),
        );
        return response.data;
    }

    async validate(behaviourId: string, code: string): Promise<ValidateResult> {
        const response = await firstValueFrom(
            this.httpService.post(`${this.serviceUrl}/api/bot-behaviors/${behaviourId}/validate`, {
                botBehaviourId: behaviourId,
                botBehaviourScript: code
            }),
        );
        return response.data;
    }
}
