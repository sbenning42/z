import { HeadersType } from "./types";

export function createSyncActionConfig<HasPayload extends boolean = true>(
    type: string,
    hasPayload: HasPayload = true as HasPayload,
    headers: HeadersType = []
) {
    return {
        type,
        hasPayload: hasPayload ? (true as true) : (false as false),
        async: (false as false),
        headers
    } as HasPayload extends true
        ? { type: string, hasPayload: true, async: false, headers?: HeadersType }
        : { type: string, hasPayload: false, async: false, headers?: HeadersType };
}
export function createAsyncActionConfig<HasPayload extends boolean = true>(
    type: string,
    hasPayload: HasPayload = true as HasPayload,
    headers: HeadersType = []
) {
    return {
        type,
        hasPayload: hasPayload ? (true as true) : (false as false),
        async: (true as true),
        headers
    } as HasPayload extends true
        ? { type: string, hasPayload: true, async: true, headers?: HeadersType }
        : { type: string, hasPayload: false, async: true, headers?: HeadersType };    
}
