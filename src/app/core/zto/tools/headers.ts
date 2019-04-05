import { Action } from "../core/types/action";

export function grabHeaderId(id: string) {
    return (action: Action<any>) => action.headers && action.headers.find(header => header.id === id);
}

export function grabHeader(type: string) {
    return (action: Action<any>) => action.headers && action.headers.find(header => header.type === type);
}
