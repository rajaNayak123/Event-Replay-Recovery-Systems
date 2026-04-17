export type ParsedStreamMessage<T = any> = {
    stream: string;
    messageId: string;
    payload: T;
};