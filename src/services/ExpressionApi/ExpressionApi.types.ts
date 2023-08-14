export type GatewayRequestHeader = {
    /**@Required String of messages to send. */
    "Content-Type": "application/json";
    /**@Required Bearer {Auth Key}. */
    Authorization: string;
    /**@Optional UUID (e.g. 408b6dca-fc5e-4be7-b5a9-cfa9d6c61a3c). */
    "X-Conversation-Id": string | null;
    /**@Optional UUID (e.g. 408b6dca-fc5e-4be7-b5a9-cfa9d6c61a3c). To save conversation history */
    "X-Recipient-Id": string | null;
}

export type GatewayRequestBody = {
    /**@Required String of messages to send. */
    query: string | null;
    /**@Required Unique UUID to identify the message. */
    "query-id": string | null;
    /**@Required Time in UNIX Epoch on sending the message. */
    timestamp: number;
}

export interface GatewayResponse {
    /**Status Code. */
    code: number | null;
    /**String of short description messages for the action. */
    description: string;
    /**Country code format alpha-2 code. */
    language: string;
    /**Message Object. */
    data?: MessageObject;
    /**UUID (e.g. 408b6dca-fc5e-4be7-b5a9-cfa9d6c61a3c). */
    "X-Conversation-Id"?: string | null;
}

export interface MessageObject {
    /**Time in milliseconds it takes to execute the query. */
    "execution-time"?: number;
    /**Time in UNIX Epoch when the query is executed. */
    timestamp?: number;
    /**ID of the query if sent by the user. */
    "query-id"?: string;
    /**Conversation ID of the message */
    conversation_id?: string;
    /**
     * a list of response messages
     * @deprecated
     */
    result?: string[];
    /**A list of  @type {ChannelMessageObject}. See details below. */
    "channel-result"?: ChannelMessageObject[];
}

export interface ChannelMessageObject {
    /** 
     * @Optional 
     * @type {TemplateObject} of instruction message
     */
    "channel-instruction"?: TemplateObject;
    /** 
     * @Optional 
     * @type {TemplateObjectChannel} of alternative instruction
     * message that is guaranteed as text type in case
     * the other specified type of message is notimplemented.
     */
    "channel-message-alt"?: TemplateObjectChannel;
    /** 
     * @type {TemplateObject} of prompt message to obtain input
     */
    "channel-message": TemplateObject;
    /** 
     * @Optional 
     * @type {TemplateObjectChannel} Template Object of prompt instruction
     * message to obtain that is guaranteed as text type in case
     * the other specified type of message is not implemented.
     */
    "channel-instruction-alt"?: TemplateObjectChannel;
}

export interface TemplateObjectChannel {
    /** */
    channels: TemplateObject[];
}

export interface TemplateObject {
    /**
     * Name of the message channel. Configurations for 
     * Mind Expression API on the subject settings correlate 
     * to the channel default.
     */
    "channel-name"?: string;
    /**
     * Type of template message. One of @type {TemplateType}
     */
    "template-type"?: TemplateType;
    /**
     * Required in case of text or code. String of content.
     * In case of quick_reply, represent the prompt message.
     */
    template?: string;
    /**Required in case of image. The url for the media */
    "image-url"?: string;
    /**Required in case of image. The type of media upload. */
    "upload-type"?: string;
    /**
     * Required in case of quick_reply. A list of @type {QuickReplyObjects}
     * buttons. See details below.
     */
    "quick-replies"?: QuickReplyObjects[];
    /**
     * Required in case of card. A list of @type {CardObjects} response
     * message. See details below.
     */
    "card-list"?: CardObjects[];

    /**
     * Date time selection. @type {DateTimeObjects}
     */
    datetime?: DateTimeObjects;

    /**
     * 
     */
    "dynamic-template-key"?: any;
    /**
     * 
     */
    "dynamic-button-key"?: any;

    /**
     * 
     */
    attachments?: AttachmentObjects[];

    /**
     * Required in case of text or code. String of content.
     * In case of quick_reply, represent the prompt message.
     * This field has same behavior as `template`
     */
    text?: string;
}

export interface QuickReplyObjects {
    /**Button label of the quick reply button. */
    label?: string;
    /**
     * Required if type is message. Message that will be
     * sent as reply when the button is pressed.
     */
    message?: string;
    /**
     * Type of action taken when the button is pressed.
     * One of link | message
     */
    type?: 'link' | 'message';
    /**Image that will be added to the button. */
    'image-uri'?: string;
    /**
     * Required if type is link. The link that the user
     * will be directed when the button is pressed.
     */
    link?: string;
}

export interface CardObjects {
    /** @required Title of the card object. */
    title: string;
    /**Sub-title of the card object. */
    'sub-title'?: string;
    /**URL of the image to be shown in the card. */
    'image-url'?: string;
    /** */
    'upload-type'?: string;
    /**A list of @type {ButtonObjects}. See details in that type. */
    buttons?: ButtonObjects[];
}

export interface ButtonObjects {
    /**Type of action taken when the button is pressed. One of link | message */
    'button-type': ButtonType;
    /**Button label. */
    label: string;
    /**
     * Required if button-type is link. The URL user will be redirected on
     * button press.
     */
    link?: string;
    /**
     * Required if button-type is message. The message that will be sent as
     * reply when the button is pressed.
     */
    message?: string;
}

export interface DateTimeObjects {
    /**Picker type one of @type {DateTimePickerType} */
    type: DateTimePickerType;
    /**Date/time format showing in UI */
    format: string;
    /**Type of limit selection */
    "date-limit-type": DateLimitType;
    /**Min date if  date-limit-type is @limited */
    "min-date": string | null | undefined;
    /**Max date if  date-limit-type is @limited */
    "max-date": string | null | undefined;
    /**Label of confirm button */
    "button-label": string;
    /**Include current day or not, use for case date-limit-type is @future_only */
    "include-current-date": boolean | null | undefined;
    /**Language of the option */
    language: SupportLanguageType;
}

export interface AttachmentObjects {
    /** */
    "attachment-type": AttachmentType;
    /** */
    url?: string;

}

export const TemplateTypes = ['text', 'card', 'quick_reply', 'image', 'code', 'free', 'datetime'] as const;
export type TemplateType = (typeof TemplateTypes)[number];

export type ButtonType = 'link' | 'message';
export type DateTimePickerType = 'date' | 'datetime' | 'time' | 'date_range';
export type AttachmentType = 'image' | 'video' | 'file' | 'record';

export const SupportLanguages = ['en', 'ko', 'th'] as const;
export type SupportLanguageType = (typeof SupportLanguages)[number];

export type DateLimitType = 'allow_all' | 'future_only' | 'limited';
