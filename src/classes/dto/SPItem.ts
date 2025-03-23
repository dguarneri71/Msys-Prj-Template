import { ISPItem } from "./ISPItem";

export class SPItem implements ISPItem {
    Id: number;
    Title?: string;
    Modified: Date;
    Created: Date;
    Author: string;
    Editor: string;

    constructor() {
        this.Id = 0;
        this.Title = undefined;
        this.Modified = new Date();
        this.Created = new Date();
        this.Author = "";
        this.Editor = "";
    }
}