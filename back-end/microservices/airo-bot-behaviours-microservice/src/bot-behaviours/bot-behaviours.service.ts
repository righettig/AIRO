import { Injectable, Logger } from "@nestjs/common";

export type BotBehaviour = { id: string, name: string, code: string };

const predefined = [
    {
        id: 'b48f74dc-b0e8-4d3c-848a-88d3fee44242', 
        name: 'Foo', 
        code: 'Console.WriteLine(\"this is the first behaviour\");'
    },
    {
        id: 'e64775dd-87e2-4d0e-b886-4846987079c7', 
        name: 'Bar', 
        code: 'Console.WriteLine(\"this is the second behaviour\");'
    },
    {
        id: 'd3cec328-96bc-4c4c-a4e9-f87105c07d35', 
        name: 'Baz', 
        code: 'Console.WriteLine(\"this is the third behaviour\");'
    }
];

@Injectable()
export class BotBehavioursRepository {
    private readonly logger = new Logger(BotBehavioursRepository.name);

    async getAllBehaviours(): Promise<BotBehaviour[]> {
        return predefined;
    }

    async getById(botBehaviourId: string): Promise<BotBehaviour> {
        return predefined.find(el => el.id === botBehaviourId);
    }
}