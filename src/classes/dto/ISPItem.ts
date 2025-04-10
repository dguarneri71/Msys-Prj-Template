/**
 * @interface
 * Tipo persona
 * @deprecated
 */
export interface IPerson {
    Name: string;
    Title: string;
}

/**
 * @interface
 * @deprecated
 */
export interface ISPItem {
    Id: number;
    Title?: string;
    Modified: Date;
    Created: Date;
    Author: IPerson;
    Editor: IPerson;
}