import { ActionSchema } from "./action-schema";
import { Typed } from "../models/typed";
import {
    AsyncRequestWithoutPayloadManager,
    AsyncRequestWithPayloadManager,
    AsyncResponseManager,
    AsyncErrorManager,
    AsyncCancelManager
} from "./action-managers";

export type AsyncActionFactories<ThisActionSchema extends ActionSchema<any, any>> = {
    Request: ThisActionSchema['HasPayload'] extends false
        ? AsyncRequestWithoutPayloadManager
        : AsyncRequestWithPayloadManager<ThisActionSchema['Payload']>;
    Response: AsyncResponseManager<ThisActionSchema['Payload'], ThisActionSchema['Result']>;
    Error: AsyncErrorManager<ThisActionSchema['Payload']>;
    Cancel: AsyncCancelManager<ThisActionSchema['Payload']>;
} & Typed;
