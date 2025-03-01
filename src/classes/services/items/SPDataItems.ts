import { SPDataBase } from "../SPDataBase";
import { IItem } from "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export class SPDataItems extends SPDataBase {
    //Metodo per recuperare tutti gli item di una lista TODO verificare con lista di grandi dimensioni
    public async getItems(listName: string): Promise<IItem[]> {
        /*let allItems: IItem[] = [];

        for await (const items of this._sp.web.lists.getByTitle("BigList").items.top(10)) {
            allItems = allItems.concat(items);
        }*/

        const items: IItem[] = await this._sp.web.lists.getByTitle(listName).items();

        return items;
    }    

    //Metodo per recuperare un singolo item
    public async getItem(listName: string, itemId: number): Promise<IItem> {
        return await this._sp.web.lists.getByTitle(listName).items.getById(itemId);
    }

    //Metodo per aggiornare un item
    public async updateItem(listName: string, itemId: number, data: any): Promise<void> {
        (await this.getItem(listName, itemId)).update(data);
    }

    //Metodo per aggiungere un item
    public async addItem(listName: string, data: any): Promise<IItem> {
        return await this._sp.web.lists.getByTitle(listName).items.add(data);
    }

    //Metodo per cancellare un item
    public async deleteItem(listName: string, itemId: number): Promise<void> {
        (await this.getItem(listName, itemId)).delete();
    }
}