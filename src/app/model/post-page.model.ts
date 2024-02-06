import { Post } from "./post.model";

export class PostPage {
    posts : Array<Post> = [];
    page! : number;
    size! : number;
    total!: number;
    first! : boolean;
    last! : boolean;
}
