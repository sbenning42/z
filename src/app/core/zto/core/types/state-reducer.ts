import { Action } from "./action";
import { ActionsSchema } from "./actions-schema";

export type StateReducer<ThisState, ThisActionsSchema extends ActionsSchema> = (
    state: ThisState,
    action: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload'] | ThisActionsSchema[keyof ThisActionsSchema]['Result']>,
) => ThisState;
