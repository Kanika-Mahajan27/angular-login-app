import { User } from "./user";

export class Comment{
    id! : string;
    postId! : string;
    postAuthorId! : string
    commentAuthor! : User;
    content! : string;
    createdAt! : Date;
}