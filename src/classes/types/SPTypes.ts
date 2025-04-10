
import { ISPItem, PersonField } from ".";

/**
 * Tipo che descrive un elemento della lista Tasks
 * @interface
 */
export interface ITask extends ISPItem {
    startDate?: Date;
    endDate?: Date;
    assignedTo?: PersonField;
    taskDetails?: string;
    projectName?: string;
}

/**
 * Tipo che definisce un field di SharePoint
 * @interface 
 */
export interface ISPField {
    Title: string;
    InternalName: string;
    TypeAsString: string;
}

/**
 * Tipo che definisce la versione dell'item.
 * Intefaccia generica che mappa le porprietà in key di tipo stringa e il value come unknown.
 * @interface
 */
export interface ISPItemVersion {
    [key: string]: unknown;
}