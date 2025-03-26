import { SPDataBase } from "../SPDataBase";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
//import "@pnp/graph/list-items";

const LOG_SOURCE: string = 'SPDataGraph';

export class SPDataGraph extends SPDataBase {

    public async getHistory(listRelUrl: string, itemId: number, serverRelativeUrl: string = "/sites/CorsoSPFX"): Promise<unknown> {
        console.log(LOG_SOURCE + " - getHistory - start on list: ", listRelUrl);
        console.log(LOG_SOURCE + " - getHistory - item id: ", itemId);
        //const serverRelativeUrl: string = "/sites/CorsoSPFX"
        const site = await this._graph.sites.getByUrl(this.sharepointHostName, serverRelativeUrl);
        console.log(LOG_SOURCE + " - getHistory - Site: ", site);

        const lists = await site.lists();
        console.log(LOG_SOURCE + " - getHistory - lists: ", lists);
        let selectedListId: string | undefined = undefined;

        lists.forEach(element => {
            console.log(LOG_SOURCE + " - getHistory - drive webUrl: ", element.webUrl);
            if (element.webUrl && decodeURI(element.webUrl).indexOf(listRelUrl) > 0) {
                selectedListId = element.id;
                return;
            }
        });

        if (selectedListId !== undefined && selectedListId) {
            console.log(LOG_SOURCE + " - getHistory - selected list ID: ", selectedListId);
            //await this._graph.sites.getById(site[])
        }

        return undefined;
    }
}