import { ActionsSchema } from "./actions-schema";
import { ActionConfig } from "../models/action-config";

export type ActionsConfig<ThisState, ThisActionsSchema extends ActionsSchema> = {
    [Key in keyof ThisActionsSchema]: ActionConfig<ThisState, ThisActionsSchema[Key]>;
};
