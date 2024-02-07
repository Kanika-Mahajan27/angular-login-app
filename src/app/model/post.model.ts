export class Post {
    id! : string;
    author! :  string;
    heading! : string;
    content! : string;
    createdAt! : Date;
    likes : Array<string> = [];
}
