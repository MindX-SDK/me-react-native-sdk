import { CustomIMessage, CustomQuickReplies, CustomReply } from "../";
import { ConversationData, ConversationParticipants } from "../MindExpressionApi/MindExpressionApi.type";
import { QuickReplyObjects } from "../services";
import { initUUID } from "./helpers/UuidHelper";
import images from "./theme/image";

export class DataConverter {
    static conversationDataToIMessage(src: ConversationData): CustomIMessage {
        return {
            _id: initUUID(src?.timestamp?.toString()),
            text: src?.data?.template ?? '',
            createdAt: new Date(src?.timestamp),
            user: {
                _id: src.sender,
                name: src.sender,
                avatar: src.sender === 'CAI' ? images.ic_cai_profile : undefined,
            },
            image: src.data?.["image-url"],
            cards: src?.data?.["card-list"],
            templateType: src?.data?.["template-type"],
            quickReplies: src?.data?.["quick-replies"]?.length
                ? DataConverter.quickReplyObjectsArrayToCustomQuickReplies(
                    src?.data?.["quick-replies"]
                )
                : undefined,
            datetime: src?.data?.datetime,
        }
    }

    static iMessageToConversationData(
        src: CustomIMessage,
        sender: ConversationParticipants = 'User'
    ): ConversationData {
        return {
            sender,
            data: {
                template: src?.text,
                "image-url": src?.image,
                "card-list": src?.cards,
                "template-type": src?.templateType,
                "quick-replies": src?.quickReplies?.values?.length
                    ? DataConverter.customQuickRepliesToQuickReplyObjectsArray(
                        src?.quickReplies
                    )
                    : undefined,
                datetime: src?.datetime,
            },
            timestamp: src.createdAt?.valueOf(),
        }
    }

    static quickReplyObjectsArrayToCustomQuickReplies(
        src: QuickReplyObjects[],
        type: 'radio' | 'checkbox' = 'radio',
        keepIt: boolean = true,
    ): CustomQuickReplies {
        return {
            type,
            keepIt,
            values: src?.map<CustomReply>(it => ({
                title: it?.label ?? '',
                value: (it?.type === 'link' ? it?.link : it?.message) ?? '',
                messageId: (it?.label ?? '') + (it?.message ?? '') + it?.link,

                "image-uri": it["image-uri"],
                actionType: it?.type,
            })) as CustomReply[],
        }
    }

    static customQuickRepliesToQuickReplyObjectsArray(
        src: CustomQuickReplies
    ): QuickReplyObjects[] {
        return src?.values?.map<QuickReplyObjects>(it => ({
            label: it?.title,
            type: it?.actionType,
            message: it?.actionType === 'message' ? it?.value : undefined,
            "image-uri": it["image-uri"],
            link: it?.actionType === 'link' ? it?.value : undefined,
        }))
    }
}