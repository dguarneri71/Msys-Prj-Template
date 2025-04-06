import { GraphFI } from "@pnp/graph";
import { SPFI } from "@pnp/sp";
import { IDataService } from "./IDataService";

/*
Classe base per inizializzare PnP/PnPjs
*/
export class SPDataBase {
    public sharepointHostName: string = "onguarneri.sharepoint.com";
    protected _sp: SPFI;
    protected _graph: GraphFI;
    protected spDataService: IDataService;

    constructor(sp: SPFI, graph: GraphFI, spDataService: IDataService) {
        this._sp = sp;
        this._graph = graph;
        this.spDataService = spDataService;
    }
}