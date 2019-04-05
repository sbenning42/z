import { Action } from "./action";

export type StateActionReducer<ThisState, Payload> = (state: ThisState, action: Action<Payload>) => ThisState;
