import { SPDataBase } from "../SPDataBase";
import { ISPField } from "classes/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";

const LOG_SOURCE: string = 'SPDataFields';

interface IViewFields {
    Items: Array<string>;
}

export class SPDataFields extends SPDataBase {
    public async getListFields(listId: string): Promise<ISPField[]> {
        const listFields: ISPField[] = await this._sp.web.lists.getById(listId).fields();
        return listFields;
    }

    public async getViewFieldInternalNames(listId: string, viewId: string): Promise<Array<string>> {
        const query = this._sp.web.lists.getById(listId).views.getById(viewId).fields;
        const fields: IViewFields = await query();
        console.log(LOG_SOURCE + " - fields: ", fields);

        const internalNames = fields.Items.map(f => {
            switch (f) {
                case "LinkTitle":
                case "LinkTitleNoMenu":
                    return "Title";
                default:
                    return f;
            }
        });

        console.log(LOG_SOURCE + " - internalNames: ", internalNames);
        return internalNames;
    }
}