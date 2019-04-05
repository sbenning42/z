import { ActionSchema } from "../types/action-schema";
import { StateActionReducer } from "../types/state-action-reducer";
import { HeadersType } from '../types/headers-type';

export class ActionConfig<ThisState, ThisActionSchema extends ActionSchema<any, any>> {
    constructor(
        public type: string,
        public reducer: ThisActionSchema['IsAsync'] extends false
            ? StateActionReducer<ThisState, ThisActionSchema['Payload']>
            : {
                request?: StateActionReducer<ThisState, ThisActionSchema['Payload']>,
                response?: StateActionReducer<ThisState, ThisActionSchema['Result']>,
                error?: StateActionReducer<ThisState, Error>,
                cancel?: StateActionReducer<ThisState, undefined>,
            },
        public staticHeaders: ThisActionSchema['IsAsync'] extends false
            ? HeadersType
            : {
                request?: HeadersType,
                response?: HeadersType,
                error?: HeadersType,
                cancel?: HeadersType,
            } = [] as any,
        public hasPayload: ThisActionSchema['HasPayload'] = false,
        public isAsync: ThisActionSchema['IsAsync'] = false,
    ) {}
}
