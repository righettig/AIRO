import { Injectable, Logger } from "@nestjs/common";

import * as crypto from 'crypto';

export type BotBehaviour = { id: string, userId?: string, name: string, code: string };

const predefined: BotBehaviour[] = [
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

const userDefined: BotBehaviour[] = [...predefined];

@Injectable()
export class BotBehavioursRepository {
    private readonly logger = new Logger(BotBehavioursRepository.name);

    async getById(botBehaviourId: string): Promise<BotBehaviour> {
        return userDefined.find(el => el.id === botBehaviourId);
    }

    async getByUserId(userId: string): Promise<BotBehaviour[]> {
        return userDefined.filter(el => !el.userId || el.userId === userId);
    }

    async create(userId: string, name: string, code: string): Promise<string> {
        const id = crypto.randomUUID();
        userDefined.push({
            id, userId, name, code,
        })
        return id;
    }

    async update(botBehaviourId: string, name: string, code: string): Promise<void> {
        const toUpdate = userDefined.findIndex(x => x.id === botBehaviourId);
        if (toUpdate) {
            userDefined[toUpdate] = { ...userDefined[toUpdate], name, code };
        }
    }

    async delete(botBehaviourId: string): Promise<void> {
        const toDelete = userDefined.findIndex(x => x.id === botBehaviourId);
        if (toDelete) {
            userDefined.splice(toDelete, 1);
        }
    }
}