import { Message } from "./message.model";

export class StatusMessage {
    sender! : string ;
    users : Record<string,string> = {};
    history : Array<Message> = [];
}
