import ErrorHandler from "../utils/errors/ErrorHandler";
import { ExpressionApi } from "../services/ExpressionApi/ExpressionApi";
import { GatewayResponse, TemplateObject } from "../services/ExpressionApi/ExpressionApi.types";
import { ApiHelper, DateTimeHelper } from "../utils";
import { initUUID } from "../utils/helpers/UuidHelper";
import { ConversationData, MindExpressionApiEvents, MindExpressionApiEventArgs } from "./MindExpressionApi.type";
import MyEventEmitter from "../utils/customs/MyEventEmitter";
import { MIGHT_NOT_ERROR_CODES, errorFromCode } from "../utils/errors";
import { Logger } from "../services/Logger/Logger";


export class MindExpressionApi {
    /**Engine URL - You can get this on the integration page. This is the main URL you will use to access the API’s endpoint*/
    private engineUrl: string;
    /**Auth Key - This is the authorization token on the integration page. This token is used to authorize your access to the Mind Expression API.*/
    private authKey: string;
    /**UUID (e.g. 408b6dca-fc5e-4be7-b5a9-cfa9d6c61a3c)*/
    private conversationId: string | null;
    /**UUID (e.g. 408b6dca-fc5e-4be7-b5a9-cfa9d6c61a3c)*/
    private currentQueryId: string | null;
    /**UUID (e.g. 408b6dca-fc5e-4be7-b5a9-cfa9d6c61a3c)*/
    private xRecipientId: string | undefined;
    /**timestamp(milliseconds) */
    private currentTimestamp: number | undefined;

    /**Splited DEVELOPER_ID from API to use later */
    DEVELOPER_ID: string;
    /**Splited SCOPE_ID from API to use later */
    SCOPE_ID: string;
    /**Instance of API query class */
    expressionApi: ExpressionApi;
    /**Map of chat messages by timestamp */
    conversationDataMap: Map<number, ConversationData>;

    /**Logger to log action events */
    private logger?: Logger;

    /** */
    eventEmitter: MyEventEmitter<
        MindExpressionApiEvents,
        MindExpressionApiEventArgs[MindExpressionApiEvents]
    >;

    /**
     * Create a new Mind Expression object
     * @param engineUrl Engine URL - You can get this on the integration page. This is the main URL you will use to access the API’s endpoint
     * @param authKey Auth Key - This is the authorization token on the integration page. This token is used to authorize your access to the Mind Expression API.
     * @param deviceUinqueId Unique id of device- This will be use to save/fetch device chat history
     * @param options options to custom MindExpressionApi:
     *      - useLogger @type {boolean}: log all events or not
     */
    constructor (engineUrl: string, authKey: string, deviceUinqueId?: string, options?: {
        useLogger?: boolean,
    }) {
        this.engineUrl = engineUrl;
        this.authKey = authKey;
        this.conversationId = null;
        this.currentQueryId = null;
        this.conversationDataMap = new Map();
        this.eventEmitter = new MyEventEmitter();
        this.xRecipientId = deviceUinqueId ? initUUID(deviceUinqueId) : initUUID();

        if (options?.useLogger) {
            this.logger = new Logger();
        }

        //FIXME: still not handle `readGatewayPath` errors
        try {
            const urlData = ApiHelper.readGatewayPath(this.engineUrl);

            this.expressionApi = new ExpressionApi(urlData.host);
            this.DEVELOPER_ID = urlData.DEVELOPER_ID;
            this.SCOPE_ID = urlData.SCOPE_ID;
            this.logger?.logEvent('init', 'succeed', urlData);
        } catch (e) {
            // console.log(e);
            this.expressionApi = new ExpressionApi('');
            this.DEVELOPER_ID = '';
            this.SCOPE_ID = '';
            this.logger?.logEvent('init', 'failed', e);
        }
        
    }

    /**
     * 
     * Start the Conversation
     * conversationId will always set to null when call function
     * @returns object of @type {GatewayResponse} the response conversation of API
     */
    greeting = async (): Promise<GatewayResponse> => {
        this.logger?.logEvent('greeting', 'triggered');
        this.resetSession();
        this.currentQueryId = initUUID();
        this.currentTimestamp = DateTimeHelper.getCurrentTimestamp();
        

        let res: GatewayResponse;
        try {
            res = await this.expressionApi.getGateway(
                this.DEVELOPER_ID,
                this.SCOPE_ID,
                {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${this.authKey}`,
                    "X-Conversation-Id": `${this.conversationId}`,
                    "X-Recipient-Id": `${this.xRecipientId}`,
                },
                {
                    query: null,
                    "query-id": this.currentQueryId,
                    timestamp: this.currentTimestamp,
                }
            );

            // If API response with an error
            if (res?.code != null && !MIGHT_NOT_ERROR_CODES.includes(res?.code)) {
                res = ErrorHandler.handleGatewayError(res);
                this.logger?.logEvent('greeting', 'failed', res);
                return res;
            }

            //FIXME: this is for reset messages list
            this.conversationDataMap?.clear();
            this.updateCAIMessages(
                res,
            );
            
            this.setSession(res?.["X-Conversation-Id"]);
            this.logger?.logEvent('greeting', 'succeed', res?.data);

        } catch(e: any) {
            res = ErrorHandler.handleGatewayError(e);
            this.logger?.logEvent('greeting', 'failed', res);
        }
        
        return res;
    }

    /**
     * 
     * Restart the Conversation
     * @returns object of @type {GatewayResponse} the response conversation of API
     */
    restart = async (): Promise<GatewayResponse> => {
        this.logger?.logEvent('restart', 'triggered');
        this.resetSession()
        return this.greeting();
    }

    
    converse = async(query: string): Promise<GatewayResponse> => {
        this.logger?.logEvent('converse', 'triggered');

        let res: GatewayResponse;
        // Return error if user not called start, or the conversationId is empty
        if (!this.conversationId) {
            res = ErrorHandler.handleGatewayError(1000);
            this.logger?.logEvent('converse', 'failed', res);
            return res;
        }

        if (!query) {
            res = ErrorHandler.handleGatewayError(210);
            this.logger?.logEvent('converse', 'failed', res);
            return res;
        }

        this.currentQueryId = initUUID();
        this.currentTimestamp = DateTimeHelper.getCurrentTimestamp();
       
        try {
            this.updateUserMessage(query);

            res = await this.expressionApi.getGateway(
                this.DEVELOPER_ID,
                this.SCOPE_ID,
                {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${this.authKey}`,
                    "X-Conversation-Id": `${this.conversationId}`,
                    "X-Recipient-Id": `${this.xRecipientId}`,
                },
                {
                    query: query,
                    "query-id": this.currentQueryId,
                    timestamp: this.currentTimestamp,
                }
            );

            // If API response with an error
            if (res?.code != null && !MIGHT_NOT_ERROR_CODES.includes(res?.code)) {
                res = ErrorHandler.handleGatewayError(res);
                this.logger?.logEvent('sendMessage', 'failed', res);
                return res;
            }

            this.updateCAIMessages(
                res,
            );
            
            this.setSession(res?.["X-Conversation-Id"]);
            this.logger?.logEvent('converse', 'succeed', res?.data);
        } catch(e: any) {
            this.logger?.logEvent('converse', 'failed', e);
            res = ErrorHandler.handleGatewayError(e);
        }
        
        return res;
    }

    getLogs = (): string[] => {
        if (!this.logger) {
            throw errorFromCode(2000);
        }

        return this.logger?.getLogTexts();
    }

    resetSession = () => {
        this.conversationId = null;
        this.conversationDataMap = new Map();
    }

    setSession = (newConversationId: string | null = null) => {
        this.conversationId = newConversationId ?? null;
    }

    /// Getters
    /**Get latest conversationId. */
    getSession = () => {
        return this.conversationId;
    }
    /**Get latest query-id that is sent. */
    getQueryId = () => {
        return this.currentQueryId;
    }

    /**Get latest timestamp sent a request. */
    getTimestamp = () => {
        return this.currentTimestamp;
    }

    /// Internal functions
    private updateMessageList = (newMessage: ConversationData, timestamp?: number) => {
        this.conversationDataMap.set(
            timestamp ?? DateTimeHelper.getCurrentTimestamp(),
            newMessage
        );

        this.eventEmitter.emit(MindExpressionApiEvents.NEW_MESSAGE, {
            newMessage,
            conversationData: [...(this?.conversationDataMap?.values() ?? [])],
        })
    }

    private updateUserMessage = (message: string) => {
        const data: TemplateObject = {
            template: message,
        }
        const finalTimestamp = DateTimeHelper.getCurrentTimestamp();

        this.updateMessageList(
            {
                sender: 'User',
                data,
                timestamp: finalTimestamp,
            },
            finalTimestamp,
        );
    }

    private updateCAIMessages = (
        response: GatewayResponse,
    ) => {
        console.log("isejai", response)
        const channelResults = response?.data?.["channel-result"] ?? [];

        for (let i = 0; i < channelResults?.length; i++) {
            const channelResult = channelResults[i];

            const channelInstruction = this.isNotEmptyTemplateObject(channelResult?.["channel-instruction"])
                ? channelResult?.["channel-instruction"]
                : undefined;
            const channelInstructionAlt = channelResult?.["channel-instruction-alt"]?.channels?.length &&
                this.isNotEmptyTemplateObject(channelResult?.["channel-instruction-alt"]?.channels?.[0])
                ? channelResult?.["channel-instruction-alt"]
                : undefined;
            const channelMessage = this.isNotEmptyTemplateObject(channelResult?.["channel-message"])
                ? channelResult?.["channel-message"]
                : undefined;
            const channelMessageAlt = channelResult?.["channel-message-alt"]?.channels?.length &&
                this.isNotEmptyTemplateObject(channelResult?.["channel-message-alt"]?.channels?.[0])
                ? channelResult?.["channel-message-alt"]
                : undefined;

            console.log(channelInstruction);
            console.log(channelInstructionAlt);
            console.log(channelMessage);
            console.log(channelMessageAlt);

            if (channelInstruction) {
                const finalTimestamp = DateTimeHelper.getCurrentTimestamp();
                this.updateMessageList(
                    {
                        sender: 'CAI',
                        data: channelInstruction,
                        timestamp: finalTimestamp,
                    },
                    finalTimestamp,
                );
            } else if (channelInstructionAlt) {
                const finalTimestamp = DateTimeHelper.getCurrentTimestamp();
                for (let alt of channelInstructionAlt.channels) {
                    this.updateMessageList(
                        {
                            sender: 'CAI',
                            data: alt,
                            timestamp: finalTimestamp,
                        },
                        finalTimestamp,
                    );
                }
            }
    
            if (channelMessage) {
                const finalTimestamp = DateTimeHelper.getCurrentTimestamp();
                this.updateMessageList(
                    {
                        sender: 'CAI',
                        data: channelMessage,
                        timestamp: finalTimestamp,
                    },
                    finalTimestamp,
                );
            } else if (channelMessageAlt) {
                const finalTimestamp = DateTimeHelper.getCurrentTimestamp();
                for (let alt of channelMessageAlt.channels) {
                    this.updateMessageList(
                        {
                            sender: 'CAI',
                            data: alt,
                            timestamp: finalTimestamp,
                        },
                        finalTimestamp,
                    );
                }
            }
            
        }
        
    }

    private isNotEmptyTemplateObject(obj?: TemplateObject): boolean {
        return !!(obj?.template ||
            obj?.["card-list"]?.length ||
            obj?.["image-url"] ||
            obj?.datetime);
    }
}