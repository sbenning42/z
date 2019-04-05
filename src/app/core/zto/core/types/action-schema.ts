export type ActionSchema<
    Payload = void,
    Result = void,
    HasPayload extends boolean = Payload extends void ? false : true,
    IsAsync extends boolean = Result extends void ? false : true,
> = {
    Payload: Payload,
    Result: Result,
    HasPayload: HasPayload,
    IsAsync: IsAsync,
};
