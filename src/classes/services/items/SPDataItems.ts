import { SPDataBase } from "../SPDataBase";
//import { IItem } from "@pnp/sp/items";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const LOG_SOURCE: string = 'SPDataItems';
export class SPDataItems extends SPDataBase {
    //Metodo per recuperare tutti gli item di una lista TODO verificare con lista di grandi dimensioni
    //questo metodo restituisce solo 100 item
    public async getItems<T>(listName: string): Promise<T[]> {
        let items: T[] = [];
        console.log(LOG_SOURCE + " - getItems() - from list '" + listName + "' ");
        try {
            if (!stringIsNullOrEmpty(listName)) {
                items = await this._sp.web.lists.getByTitle(listName).items();
            }
        } catch (e) {
            console.log(LOG_SOURCE + " - getItems() - error: ", e);
        }

        return items;
    }

    /*public async getItems4LargeList<T>(listName: string): Promise<T[]> {
        let result: T[] = [];

        for await (const items of this._sp.web.lists.getByTitle(listName).items.top(1000)) {
            console.log(items); //array of 10 items
            result = result.concat(items);
            break; // closes the iterator, returns -- stops retrieving pages
        }

        return result;
    }*/

    //Metodo per recuperare un singolo item
    public async getItem<T>(listName: string, itemId: number | undefined): Promise<T | undefined> {
        if (itemId !== undefined) {
            const item: T = await this._sp.web.lists.getByTitle(listName).items.getById(itemId)();
            return item;
        }
        else{
            return undefined;
        }
    }

    //Metodo per aggiornare un item
    public async updateItem(listName: string, itemId: number | undefined, data: Record<string, unknown>): Promise<void> {
        if (itemId !== undefined) {
            await this._sp.web.lists.getByTitle(listName).items.getById(itemId).update(data);
        }
    }

    //Metodo per aggiungere un item
    public async addItem<T>(listName: string, data: Record<string, unknown>): Promise<T> {
        return await this._sp.web.lists.getByTitle(listName).items.add(data);
    }

    //Metodo per cancellare un item
    public async deleteItem(listName: string, itemId: number | undefined): Promise<void> {
        console.log(LOG_SOURCE + " - deleteItem() - from list '" + listName + "' - ID: '" + itemId + "' ");
        if (itemId !== undefined) {
            try {
                //await this._sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
                await this._sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
                console.log(LOG_SOURCE + " - deleteItem() - item deleted.");
            }
            catch (e) {
                console.log(LOG_SOURCE + " - deleteItem() - item deleted with error.", e);
            }
        }
    }
}