export interface BotBehaviour {
    id: string;
    name: string;
    code: string;
}

export interface BotBehaviourViewModel extends BotBehaviour {
    editing: boolean;
    modified: boolean;
}