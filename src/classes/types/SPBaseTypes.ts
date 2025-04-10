/**
 * Tipo per colonne Person/Group esteso, va rimappato
 * @type
 */
export type PersonField = {
    /**
     * @field corrisponde a LookupId
     */
    Id: number;
    /**
     * @field corrisponde a LookupValue
     */
    Title?: string;
    Email?: string;
};

/**
 * Tipo per colonne Person/Group standard
 * @type
 */
export type PersonFieldLookup = {
    LookupId?: number;
    LookupValue?:string;
    Email?: string;
};

/**
 * Tipo per colonne Lookupcon campi rinominati
 * @type
 */
export type ExtendedLookupField = {
    /**
     * @field corrisponde a LookupId
     */
    Id: number;
    /**
     * @field corrisponde a LookupValue
     */
    Title?: string;
};

/**
 * Classico campo lookup
 * @type
 */
export type LookupField = {
    LookupId: number;
    LookupValue?:string;
};

/**
 * Interfaccia generica per un item SharePoint, legge tutte le proprietà.
 * [key]: string
 * [value]: number | string | Date | unknown
 * @interface
 */
export interface ISPGenericItem {
    [property: string]: number | string | Date | unknown;
 }

/**
 * Tipo base per gli elementi SharePoint (opzionale, ma utile da estendere)
 * @interface
 */
export interface ISPItem {
    Id: number;
    Title?: string;
    Created?: Date;
    Modified?: Date;
    Author?: PersonField;
    Editor?: PersonField;
    //[key: string]: unknown; // Campo generico per proprietà aggiuntive (senza any!)
}