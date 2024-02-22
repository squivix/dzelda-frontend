import {defineStore} from "pinia";
import {useTimeoutFn} from "@vueuse/core";

export enum MessageType {
    INFO = "info",
    ERROR = "error",
    WARNING = "warning",
    SUCCESS = "success"
}

export interface Message {
    uuid: string
    text: string,
    type: MessageType,
    timeoutMs?: number,
    isMarkdown?: boolean,
    isDismissable?: boolean,
}

export const useMessageBarStore = defineStore("messageBar", {
    state() {
        return {
            topBarMessageQueue: [] as Message[],
            sideMessageQueue: [] as Message[]
        };
    },
    actions: {
        addSideMessage(messageData: Omit<Message, "uuid">) {
            if (messageData.isDismissable == undefined)
                messageData.isDismissable = true;
            const newMessage = {...messageData, uuid: crypto.randomUUID()};
            this.sideMessageQueue.unshift(newMessage);
            if (newMessage.timeoutMs !== undefined)
                useTimeoutFn(() => {
                    const index = this.sideMessageQueue.findIndex((m) => m.uuid == newMessage.uuid);
                    if (index !== -1)
                        this.sideMessageQueue.splice(index, 1);
                }, newMessage.timeoutMs);
        },
        removeSideMessage(message: Message) {
            const index = this.sideMessageQueue.findIndex((m) => m.uuid == message.uuid);
            if (index !== -1)
                this.sideMessageQueue.splice(index, 1);
        },
        clearSideMessages() {
            if (this.sideMessageQueue.length > 0)
                this.sideMessageQueue.length = 0;
        },
        addTopBarMessage(messageData: Omit<Message, "uuid">) {
            if (messageData.isDismissable == undefined)
                messageData.isDismissable = true;
            const newMessage = {...messageData, uuid: crypto.randomUUID()};

            if (this.topBarMessageQueue.length >= 3)
                this.topBarMessageQueue.pop();

            if (this.topBarMessageQueue.find((m) => m.text == newMessage.text && m.type == newMessage.type))
                return;
            this.topBarMessageQueue.unshift(newMessage);
        },
        removeTopBarMessage(message: Message) {
            const index = this.topBarMessageQueue.findIndex((m) => m.uuid == message.uuid);
            if (index !== -1)
                this.topBarMessageQueue.splice(index, 1);
        },
        clearTopBarMessages() {
            if (this.topBarMessageQueue.length > 0)
                this.topBarMessageQueue.length = 0;
        }
    }

});
