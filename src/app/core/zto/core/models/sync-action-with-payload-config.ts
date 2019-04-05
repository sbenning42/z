import { ActionSchema } from "../types/action-schema";
import { StateActionReducer } from "../types/state-action-reducer";
import { HeadersType } from '../types/headers-type';
import { ActionConfig } from "./action-config";

export class SyncActionWithPayloadConfig<ThisState, ThisActionSchema extends ActionSchema<any, any, true, false>> extends ActionConfig<ThisState, ThisActionSchema> {
    constructor(
        type: string,
        reducer: StateActionReducer<ThisState, ThisActionSchema['Payload']>,
        staticHeaders: HeadersType = [] as any
    ) {
        super (type, reducer as any, staticHeaders as any, true, false);
    }
}
