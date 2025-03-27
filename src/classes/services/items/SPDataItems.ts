import { SPDataBase } from "../SPDataBase";
import { stringIsNullOrEmpty } from "@pnp/core";
import { ISPItem } from "../../dto/ISPItem";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemVersion } from "@pnp/sp/items";

const LOG_SOURCE: string = 'SPDataItems';

/**
 * @class 
 * Classe che contiene i metodi per lavorare con gli item di una lista SharePoint
 * @extends {SPDataBase}
 */
export class SPDataItems extends SPDataBase {
    /**
     * Metodo per recuperare tutti gli item di una lista.
     * 
     * Questo metodo restituisce solo 100 item
     * @param listName 
     * @returns Un array di oggetti
     */
    public async getItems<T>(listName: string): Promise<T[]> {
        let items: T[] = [];
        console.log(LOG_SOURCE + " - getItems() - from list '" + listName + "' ");
        try {
            if (!stringIsNullOrEmpty(listName)) {
                items = await this._sp.web.lists.getByTitle(listName).items.select("*", "Author/ID", "Author/Title").expand("Author")();
            }
        } catch (e) {
            console.log(LOG_SOURCE + " - getItems() - error: ", e);
        }

        return items;
    }

    public async getItemVersions(listId: string, Id: number): Promise<IItemVersion[]> {
        const itemVersions: IItemVersion[] = await this._sp.web.lists.getById(listId).items.getById(Id).select("*", "Author/ID", "Author/Title").expand("Author").versions();
        console.log("getItemVersions: ", itemVersions);
        return itemVersions;
    }

    /*
    //Non funziona
    public async getItems4LargeList<T>(listName: string): Promise<T[]> {
        let result: T[] = [];

        for await (const items of this._sp.web.lists.getByTitle(listName).items.top(1000)) {
            console.log(items); //array of 10 items
            result = result.concat(items);
            break; // closes the iterator, returns -- stops retrieving pages
        }

        return result;
    }*/

    //Parametro destrutturato - significa che del parametro passato prendo solo la proprietà Id
    public async getItem<T>(listName: string, { Id }: ISPItem): Promise<T> {
        const item: T = await this._sp.web.lists.getByTitle(listName).items.getById(Id).select("*", "Author/ID", "Author/Title").expand("Author")();
        console.log("getItem: ", item);
        return item;
    }

    /**
     * Metodo per aggiornare un item
     * @param listName Il Title della lista SharePoint
     * @param {ISPItem} id L'id estratto dal tipo ISPItem
     * @param {Record<string, unknown>} data Elenco di chiave valore per aggiornare i metadati di un item.
     */
    public async updateItem(listName: string, { Id }: ISPItem, data: Record<string, unknown>): Promise<void> {
        await this._sp.web.lists.getByTitle(listName).items.getById(Id).update(data);
    }

    /**
     * Metodo per aggiungere un item
     * @param listName Il Title della lista SharePoint
     * @param {Record<string, unknown>} data Elenco di chiave valore per creare un item con metadati
     * @returns Un oggetto che rappresente l'item creato
     */
    public async addItem<T>(listName: string, data: Record<string, unknown>): Promise<T> {
        return await this._sp.web.lists.getByTitle(listName).items.add(data);
    }

    //Metodo per cancellare un item
    public async deleteItem(listName: string, { Id }: ISPItem): Promise<void> {
        console.log(LOG_SOURCE + " - deleteItem() - from list '" + listName + "' - ID: '" + Id + "' ");

        //Demo errore
        if (Id % 2 === 0) {
            throw new Error("Non puoi cancellare gli elementi pari");
        }

        try {
            await this._sp.web.lists.getByTitle(listName).items.getById(Id).delete();
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