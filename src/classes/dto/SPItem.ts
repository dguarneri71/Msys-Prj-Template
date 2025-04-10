import { IPerson, ISPItem } from "./ISPItem";

/**
 * @class
 * Classe che implementa un elemento di una lista SHarePoint
 * @deprecated
 */
export class SPItem implements ISPItem {
    Id: number;
    Title?: string;
    Modified: Date;
    Created: Date;
    Author: IPerson;
    Editor: IPerson;

    constructor() {
        this.Id = 0;
        this.Title = undefined;
        this.Modified = new Date();
        this.Created = new Date();
        this.Author = {Name: "", Title: ""};
        this.Editor = {Name: "", Title: ""};
    }
}