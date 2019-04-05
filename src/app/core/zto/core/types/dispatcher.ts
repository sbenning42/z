import { ActionsSchema } from "./actions-schema";
import { Action } from "./action";
import { Typed } from "../models/typed";

export type Dispatcher<ThisActionsSchema extends ActionsSchema> = {
    dispatch: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>;
    onFinish: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Result'] | undefined>;
    onRequest: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>;
    onResponse: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<ThisActionsSchema[keyof ThisActionsSchema]['Result']>;
    onError: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<Error>;
    onCancel: (request: Action<ThisActionsSchema[keyof ThisActionsSchema]['Payload']>) => Action<undefined>;
} & Typed;
