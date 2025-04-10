/**
 * Tipo per colonne Person/Group (expandibili)
 */
export type PersonField = {
    Id?: number;
    Title?: string;
    Email?: string;
};

export type PersonFieldLookup = {
    LookupId?: number;
    LookupValue?:string;
    Email?: string;
};

/**
 * Tipo per colonne Lookup
 */
export type ExtendedLookupField = {
    Id: number;
    Title?: string;
};

export type LookupField = {
    LookupId: number;
    LookupValue?:string;
};

// Utility per convertire Date da stringa
//export type DateString = string; // SharePoint restituisce date come stringhe

/**
 * Tipo base per gli elementi SharePoint (opzionale, ma utile per estendere)
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