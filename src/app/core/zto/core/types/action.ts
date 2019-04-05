import { ActionWithPayload } from "../models/action-with-payload";

export type Action<Payload> = Payload extends void ? ActionWithPayload<undefined> : ActionWithPayload<Payload>;
