export interface IPerson {
    Id: number;
    Title: string;
}

export interface ISPItem {
    Id: number;
    Title?: string;
    Modified: Date;
    Created: Date;
    Author: IPerson;
    Editor: string;
}