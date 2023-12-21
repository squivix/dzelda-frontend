import {defineStore} from "pinia";

export enum MessageType {
    INFO = "info",
    ERROR = "error",
    WARNING = "warning",
    SUCCESS = "success"
}

export interface Message {
    text: string,
    type: MessageType
}

export const useMessageBarStore = defineStore("messageBar", {
    state() {
        return {
            messageQueue: [] as Message[]
        };
    },
    actions: {
        addMessage(newMessage: Message) {
            if (this.messageQueue.length >= 3)
                this.removeEarliestMessage();

            if (this.messageQueue.find((m) => m.text == newMessage.text && m.type == newMessage.type))
                return;
            this.messageQueue.unshift(newMessage);
        },
        removeEarliestMessage() {
            this.messageQueue.pop();
        },
        removeMessage(index: number) {
            this.messageQueue.splice(index, 1);
        },
        clearMessages() {
            if (this.messageQueue.length > 0)
                this.messageQueue.length = 0;
        }
    }

});
