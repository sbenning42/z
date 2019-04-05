import { ActionsSchema } from "./actions-schema";
import { ActionConfig } from "../models/action-config";
import { AsyncActionWithoutPayloadConfig } from "../models/async-action-without-payload-config";

export type ActionsConfig<ThisState, ThisActionsSchema extends ActionsSchema> = {
    [Key in keyof ThisActionsSchema]: ActionConfig<ThisState, ThisActionsSchema[Key]>|AsyncActionWithoutPayloadConfig<ThisState, ThisActionsSchema[Key]>;
};
