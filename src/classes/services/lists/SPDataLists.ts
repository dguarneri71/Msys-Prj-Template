import { GraphFI } from "@pnp/graph";
import { SPFI } from "@pnp/sp";
import { IList } from "@pnp/sp/lists";

//TODO: implementare metodi CRUD
export class SPDataLists {
    private _sp: SPFI;
    private _graph: GraphFI;

    constructor(sp: SPFI, graph: GraphFI) {
        this._sp = sp;
        console.log("SP:" , this._sp);
        this._graph = graph;
        console.log("GRAPH:" , this._graph);
    }

    public async getLists(): Promise<IList[]> {
        return await this._sp.web.lists();
    }

    public getItems(): string {
        return "";
    }
}