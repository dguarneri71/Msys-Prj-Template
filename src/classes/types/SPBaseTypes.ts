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
 * Tipo base per gli elementi SharePoint (opzionale, ma utile per estendere)
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