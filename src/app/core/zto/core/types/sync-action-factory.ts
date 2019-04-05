import { ActionSchema } from "./action-schema";
import { Typed } from "../models/typed";
import { SyncActionWithoutPayloadManager, SyncActionWithPayloadManager } from "./action-managers";

export type SyncActionFactory<ThisActionSchema extends ActionSchema<any, any>> = {
    Action: ThisActionSchema['HasPayload'] extends false
        ? SyncActionWithoutPayloadManager
        : SyncActionWithPayloadManager<ThisActionSchema['Payload']>
} & Typed;
