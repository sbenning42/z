import { Action } from "./action";

export type SyncActionWithPayloadFactory<Payload> = new (payload: Payload, headers?: Headers) => Action<Payload>;
export type SyncActionWithoutPayloadFactory = new (headers?: Headers) => Action<undefined>;
export type AsyncRequestWithPayloadFactory<Payload> = new (payload: Payload, headers?: Headers) => Action<Payload>;
export type AsyncRequestWithoutPayloadFactory = new (headers?: Headers) => Action<undefined>;
export type AsyncResponseFactory<Payload, Result> = new (payload: Result, request: Action<Payload>, headers?: Headers) => Action<Result>;
export type AsyncErrorFactory<Payload> = new (payload: Error, request: Action<Payload>, headers?: Headers) => Action<Error>;
export type AsyncCancelFactory<Payload> = new (request: Action<Payload>, headers?: Headers) => Action<undefined>;
