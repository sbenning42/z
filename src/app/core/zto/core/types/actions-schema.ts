import { ActionSchema } from "./action-schema";

export type ActionsSchema = {
    [x: string]: ActionSchema<any |void, any |void>;
}
