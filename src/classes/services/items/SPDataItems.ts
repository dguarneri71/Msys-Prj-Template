import { SPBaseData } from "../SPBaseData";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ISPItemVersion } from "classes/types";

const LOG_SOURCE: string = 'SPDataItems';

/**
 * Opzioni per la query degli elementi di una lista SharePoint.
 * @template T - Tipo dell'oggetto restituito dopo il mapping.
 */
export interface GetListItemsOptions<T = unknown> {
    /** Nome della lista SharePoint */
    listTitle: string;
    /** Colonne da selezionare (default: ["Id", "Title"]) */
    select?: string[];
    /** Colonne da espandere (es: ["AssignedTo", "LookupField"]) */
    expand?: string[];
    /** Filtro OData (es: "Status eq 'Active'"). Non usato in GetItem */
    filter?: string;
    /** 
     * Funzione per mappare l'item SharePoint nel tipo desiderato.
     * @default (item) => item as T (nessuna trasformazione)
     */
    mapper?: (item: Record<string, unknown>) => T;
}

/** Opzioni per la query di un elemento di una lista SharePoint. */
export interface GetListItemOptions extends GetListItemsOptions {
    /** ID dell'item della lista SharePoint */
    id: number;
}

/**
 * Opzioni per la query degli elementi di una lista SharePoint.
 * @template T - Tipo dell'oggetto restituito dopo il mapping.
 */
export interface AddListItemOptions<T = unknown> {
    /** Nome della lista SharePoint */
    listTitle: string;
    /** Elenco di chiave valore per creare un item con metadati */
    data: Record<string, unknown>;
    /** 
     * Funzione per mappare l'item SharePoint nel tipo desiderato.
     * @default (item) => item as T (nessuna trasformazione)
     */
    mapper?: (item: Record<string, unknown>) => T;
}

/** Opzioni per aggiornare un item */
export interface UpdateListItemOptions extends AddListItemOptions {
    /** ID dell'item della lista SharePoint */
    id: number;
}

/** Opzioni per eliminare un elemento di una lista SharePoint. */
export interface DeleteListItemOptions {
    /** Nome della lista SharePoint */
    listTitle: string;
    /** ID dell'item della lista SharePoint */
    id: number;
}

/**
 * @class 
 * Classe che contiene i metodi per lavorare con gli item di una lista SharePoint
 * @extends {SPBaseData}
 */
export class SPDataItems extends SPBaseData {
    /**
    * Recupera elementi da una lista SharePoint con tipizzazione dinamica.
    * @template T - Tipo di ritorno dopo il mapping.
    * @param {GetListItemsOptions<T>} options - Configurazione della query.
    * @returns {Promise<T[]>} Array di elementi tipizzati.
    */
    public async getListItems<T = Record<string, unknown>>(
        options: GetListItemsOptions<T>
    ): Promise<T[]> {
        try {
            const { listTitle, select = ["Id", "Title"], expand = [], filter = "", mapper = (item) => item as T } = options;

            const query = this._sp.web.lists.getByTitle(listTitle).items;

            if (select.length > 0) query.select(...select);
            if (expand.length > 0) query.expand(...expand);
            if (filter) query.filter(filter);

            const items = await query();
            return items.map(mapper);

        } catch (error) {
            console.error(`Errore nel recupero della lista "${options.listTitle}":`, error);
            throw error;
        }
    }

    /**
     * Recupera tutte le versioni di un item / folder da una lista
     * @param listId ID della lista 
     * @param Id ID dell'item
     * @returns {ISPItemVersion[]} array di versioni dell'item
     */
    public async getItemVersions(listId: string, Id: number): Promise<ISPItemVersion[]> {
        //const viewFields = await this.spDataService.fields?.getViewFieldInternalNames(listId, viewId);
        //console.log("getItemVersions - fields", viewFields);
        const itemVersions: ISPItemVersion[] = await this._sp.web.lists.getById(listId).items.getById(Id).select("*", "Author/ID", "Author/Title").expand("Author").versions();
        console.log("getItemVersions - item versions ", itemVersions);
        return itemVersions;
    }

    /**
     * Recupera un elemento da una lista SharePoint
     * @param {GetListItemOptions} options Opzioni per recuperare un item.
     * @returns 
     */
    public async getItem<T>(options: GetListItemOptions): Promise<T> {
        const { listTitle, id, select = ["Id", "Title", "Author/ID", "Author/Title", "Author/Email"], expand = ["Author"], mapper = (item) => item as T } = options;
        const query = this._sp.web.lists.getByTitle(listTitle).items.getById(id);

        if (select.length > 0) query.select(...select);
        if (expand.length > 0) query.expand(...expand)

        const item = await query();

        console.log("getItem: ", item);
        return mapper(item) as T;
    }

    /**
     * Metodo per aggiornare un item
     * @param {UpdateListItemOptions} options Opzioni per l'aggiornamento di un item.
     * @returns {Promise<T>} L'item aggiornato, tipizzato
     */
    public async updateItem<T>(options: UpdateListItemOptions): Promise<T> {
        const { listTitle, id, data, mapper = (item) => item as T } = options;
        const _item = await this._sp.web.lists.getByTitle(listTitle).items.getById(id).update(data);
        return await mapper(_item) as T;
    }

    /**
     * Metodo per aggiungere un item
     * @param {AddListItemOptions} options Opzioni per la creazione di un item.
     * @returns {Promise<T>} L'item creato, tipizzato
     */
    public async addItem<T>(options: AddListItemOptions): Promise<T> {
        //Recupero i parametri e stabilisco i default.
        const { listTitle, data, mapper = (item) => item as T } = options;
        const _item = await this._sp.web.lists.getByTitle(listTitle).items.add(data);
        return mapper(_item) as T;
    }

    /**
     * Metodo per cancellare un item
     * @param listName Il title della lista
     * @param id 
     */
    public async deleteItem(options: DeleteListItemOptions): Promise<void> {
        console.log(LOG_SOURCE + " - deleteItem() - from list '" + options.listTitle + "' - ID: '" + options.id + "' ");

        try {
            await this._sp.web.lists.getByTitle(options.listTitle).items.getById(options.id).delete();
            console.log(LOG_SOURCE + " - deleteItem() - item deleted.");
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                console.log(LOG_SOURCE + " - deleteItem() - item deleted with error: '" + error.message + "'");
            }
            else {
                console.log(LOG_SOURCE + " - deleteItem() - item deleted with generic error: ", error);
            }
        }
    }
}