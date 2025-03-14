import { SPDataBase } from "../SPDataBase";
import { IItem } from "@pnp/sp/items";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const LOG_SOURCE: string = 'SPDataItems';
export class SPDataItems extends SPDataBase {
    //Metodo per recuperare tutti gli item di una lista TODO verificare con lista di grandi dimensioni
    //questo metodo restituisce solo 100 item
    public async getItems(listName: string): Promise<IItem[]> {
        let items: IItem[] = [];
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

    //Restituire il DTO TaskItem
    public async getTaskItems(listName: string): Promise<unknown[]> {
        let items: unknown[] = [];
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
      
    /*public async getItems4LargeList(listName: string): Promise<IItem[]> {
        let result: any = [];

        //TODO: come si fa?
        for await (const items of this._sp.web.lists.getByTitle(listName).items.top(1000)) {
            console.log(items); //array of 10 items
            result = result.concat(items);
            break; // closes the iterator, returns -- stops retrieving pages
        }

        return result;
    }*/

    //Metodo per recuperare un singolo item
    public async getItem(listName: string, itemId: number): Promise<IItem> {
        return await this._sp.web.lists.getByTitle(listName).items.getById(itemId);
    }

    //Metodo per aggiornare un item
    public async updateItem(listName: string, itemId: number, data: Record<string, unknown>): Promise<void> {
        await (await this.getItem(listName, itemId)).update(data);
    }

    //Metodo per aggiungere un item
    public async addItem(listName: string, data: Record<string, unknown>): Promise<IItem> {
        return await this._sp.web.lists.getByTitle(listName).items.add(data);
    }

    //Metodo per cancellare un item
    public async deleteItem(listName: string, itemId: number): Promise<void> {
        console.log(LOG_SOURCE + " - deleteItem() - from list '" + listName + "' - ID: '" + itemId + "' ");
        const item = await this.getItem(listName, itemId); 
        try {
            //await this._sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
            await item.delete();
            console.log(LOG_SOURCE + " - deleteItem() - item deleted.");
        }
        catch (e) {
            console.log(LOG_SOURCE + " - deleteItem() - item deleted with error.", e);
        }
    }
}