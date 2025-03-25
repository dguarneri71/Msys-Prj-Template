//TODO: creare type Person da assegnare a Author ed Edit
export interface ISPItem {
    Id: number;
    Title?: string;
    Modified: Date;
    Created: Date;
    Author: string;
    Editor: string;
}