import { ActionSchema } from "../types/action-schema";
import { StateActionReducer } from "../types/state-action-reducer";
import { HeadersType } from '../types/headers-type';
import { ActionConfig } from "./action-config";

export class AsyncActionWithoutPayloadConfig<ThisState, ThisActionSchema extends ActionSchema<any, any, false, true>> extends ActionConfig<ThisState, ThisActionSchema> {
    constructor(
        type: string,
        reducer: {
            request?: StateActionReducer<ThisState, ThisActionSchema['Payload']>,
            response?: StateActionReducer<ThisState, ThisActionSchema['Result']>,
            error?: StateActionReducer<ThisState, Error>,
            cancel?: StateActionReducer<ThisState, undefined>,
        },
        staticHeaders: {
            request?: HeadersType,
            response?: HeadersType,
            error?: HeadersType,
            cancel?: HeadersType,
        } = [] as any,
    ) {
        super (type, reducer as any, staticHeaders as any, false, true);
    }
}
