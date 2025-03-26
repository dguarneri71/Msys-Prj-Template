import { ISite } from "@pnp/graph/sites";
import { SPDataBase } from "../SPDataBase";
import "@pnp/graph/sites";
import "@pnp/graph/files";
import "@pnp/graph/lists";
import "@pnp/graph/list-items";

const LOG_SOURCE: string = 'SPDataGraph';

export class SPDataGraph extends SPDataBase {

    public async getHistory(listRelUrl: string, itemId: number, serverRelativeUrl: string = "/sites/CorsoSPFX"): Promise<unknown> {
        console.log(LOG_SOURCE + " - getHistory - start on list: ", listRelUrl);
        console.log(LOG_SOURCE + " - getHistory - item id: ", itemId);
        //const serverRelativeUrl: string = "/sites/CorsoSPFX"
        const site: ISite = await this._graph.sites.getByUrl(this.sharepointHostName, serverRelativeUrl);
        console.log(LOG_SOURCE + " - getHistory - Site: ", site);

        const drives = await site.drives();
        console.log(LOG_SOURCE + " - getHistory - drives: ", drives);
        let selectedDrive = undefined;

        drives.forEach(element => {
            console.log(LOG_SOURCE + " - getHistory - drive webUrl: ", element.webUrl);
            if (element.webUrl && decodeURI(element.webUrl).indexOf(listRelUrl) > 0) {
                selectedDrive = element;
                return;
            }
        });

        if (selectedDrive !== undefined && selectedDrive) {
            console.log(LOG_SOURCE + " - getHistory - selected drive: ", selectedDrive);
            //await selectedDrive["Id"]
        }

        return undefined;
    }
}