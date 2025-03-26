import { GraphFI } from "@pnp/graph";
import { SPFI } from "@pnp/sp";

/*
Classe base per iniziallizzare PnP/PnPjs
*/
export class SPDataBase {
    public sharepointHostName: string = "onguarneri.sharepoint.com";
    protected _sp: SPFI;
    protected _graph: GraphFI;

    constructor(sp: SPFI, graph: GraphFI) {
        this._sp = sp;
        this._graph = graph;
    }
}