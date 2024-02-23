import { Message } from "./message.model";
import { UserInfo } from "./userInfo.model";

export class StatusMessage {
    senderId! : string ;
    senderName! :string;
    users : Array<UserInfo> = [];
    history : Record<string,Array<Message>> = {};
}
