import { ActionSchema } from "../types/action-schema";
import { ActionConfig } from "./action-config";
import { StateActionReducer } from "../types/state-action-reducer";
import { HeadersType } from "../types/headers-type";

export class SyncActionWithoutPayloadConfig<ThisState, ThisActionSchema extends ActionSchema<any, any, false, false>> extends ActionConfig<ThisState, ThisActionSchema> {
    constructor(
        type: string,
        reducer: StateActionReducer<ThisState, undefined>,
        staticHeaders: HeadersType,
    ) {
        super(type, reducer as any, staticHeaders as any, false, false);
    }
}
