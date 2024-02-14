import { Author } from "./author.model";

export class Post {
    id! : string;
    author! :  Author;
    content! : string;
    createdAt! : Date;
    likes : Array<string> = [];
}
