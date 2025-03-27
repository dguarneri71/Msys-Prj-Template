/**
 * @interface
 * Tipo persona
 */
export interface IPerson {
    Name: string;
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