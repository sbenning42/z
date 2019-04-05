import { Headers } from "../types/headers";

export class ActionWithPayload<Payload> {
    constructor(
        public type: string,
        public payload: Payload,
        public headers: Headers = [],
    ) {}
}
