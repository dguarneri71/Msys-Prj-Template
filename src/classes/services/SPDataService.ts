import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { AadHttpClientFactory, AadTokenProviderFactory, HttpClient } from "@microsoft/sp-http";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, GraphFI, SPFx as gSPFx } from "@pnp/graph";
import { IDataService } from "./IDataService";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

import { SPDataLists } from "./lists/SPDataLists";

const LOG_SOURCE: string = 'SPDataService';

export default class SPDataService implements IDataService {
    //Registro il servizio
    public static readonly serviceKey: ServiceKey<IDataService> = ServiceKey.create<IDataService>('SPFx:SPDataService', SPDataService);

    private _sp: SPFI;
    private _graph: GraphFI;
    private httpClient: HttpClient;
    private aadHttpClientFactory: AadHttpClientFactory;

    private _lists: SPDataLists | undefined = undefined;

    constructor(serviceScope: ServiceScope) {
        console.log(LOG_SOURCE + " - constructor() - ServiceScope: ", serviceScope);

        serviceScope.whenFinished(() => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this.aadHttpClientFactory = serviceScope.consume(AadHttpClientFactory.serviceKey);
            console.log(LOG_SOURCE + " - constructor() - aadHttpClientFactory: ", this.aadHttpClientFactory);
            //https://ypcode.io/posts/2019/01/spfx-webpart-scoped-service/
            //this.httpClient = serviceScope.consume(SPHttpClient.serviceKey);
            this.httpClient = serviceScope.consume(HttpClient.serviceKey);
            console.log(LOG_SOURCE + " - constructor() - httpClient: ", this.httpClient);
            const aadTokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);

            //SharePoint
            this._sp = spfi().using(spSPFx({ pageContext }));
            console.log(LOG_SOURCE + " - constructor() - _sp: ", this._sp);
            //Graph
            this._graph = graphfi().using(gSPFx({ aadTokenProviderFactory }));
            console.log(LOG_SOURCE + " - constructor() - _graph: ", this._graph);
        });
    }

    public get lists() : SPDataLists {
        if(this._lists === undefined){
            this._lists = new SPDataLists(this._sp, this._graph);
        }
        return this._lists;
    }

    
 }