import { Comment } from "./comment.model";

export class CommentPage {
    comments! : Array<Comment>;
    page! : number;
    size! : number;
    total! : number;
    first! : boolean;
    last! : boolean;
}