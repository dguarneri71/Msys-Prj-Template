import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { AadHttpClientFactory, AadTokenProviderFactory, HttpClient } from "@microsoft/sp-http";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, GraphFI, SPFx as gSPFx } from "@pnp/graph";
/**
 * @import IDataService
 */
import { IDataService } from "./IDataService";
/** 
 * @import SPDataLists
 */
import { SPDataLists } from "./lists/SPDataLists";
/**
 * @import SPDataItems
 */
import { SPDataItems } from "./items/SPDataItems";
/**
 * @import SPDataFiles
 */
import { SPDataFiles } from "./files/SPDataFiles";
/**
 * @import SPDataGraph
 */
import { SPDataGraph } from "./graphLib/SPDataGraph";

const LOG_SOURCE: string = 'SPDataService';

export default class SPDataService implements IDataService {
    //Registro il servizio
    public static readonly serviceKey: ServiceKey<IDataService> = ServiceKey.create<IDataService>('SPFx:SPDataService', SPDataService);

    public _sp: SPFI | undefined = undefined;
    private _graph: GraphFI | undefined = undefined;
    private httpClient: HttpClient | undefined = undefined;
    private aadHttpClientFactory: AadHttpClientFactory | undefined = undefined;
    //definisco le classi "d'estensione"
    private _lists: SPDataLists | undefined = undefined;
    private _items: SPDataItems | undefined = undefined;
    private _files: SPDataFiles | undefined = undefined;
    private _graphLib: SPDataGraph | undefined = undefined;

    //Costruttore per inizializzare pnp/pnpjs, usa gli scope.
    //https://ypcode.io/posts/2019/01/spfx-webpart-scoped-service/
    constructor(serviceScope: ServiceScope) {
        console.log(LOG_SOURCE + " - constructor() - ServiceScope: ", serviceScope);

        serviceScope.whenFinished(() => {
            this.aadHttpClientFactory = serviceScope.consume(AadHttpClientFactory.serviceKey);
            console.log(LOG_SOURCE + " - constructor() - aadHttpClientFactory: ", this.aadHttpClientFactory);
            
            this.httpClient = serviceScope.consume(HttpClient.serviceKey);
            console.log(LOG_SOURCE + " - constructor() - httpClient: ", this.httpClient);

            //SharePoint
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this._sp = spfi().using(spSPFx({ pageContext }));
            console.log(LOG_SOURCE + " - constructor() - _sp: ", this._sp);
            
            //Graph
            const aadTokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);
            this._graph = graphfi().using(gSPFx({ aadTokenProviderFactory }));
            console.log(LOG_SOURCE + " - constructor() - _graph: ", this._graph);
        });
    }

    /**
     * Istanzio classe SPDataLists solo se necessaria - Lazy loading
     * @this {SPDataService}
     * @return {SPDataLists | undefined}
     */
    public get lists(): SPDataLists | undefined {
        if (this._lists === undefined && this._sp !== undefined && this._graph !== undefined) {
            this._lists = new SPDataLists(this._sp, this._graph);
        }
        return this._lists;
    }

    /**
     * Istanzio classe SPDataItems solo se necessaria - Lazy loading
     * @this {SPDataService}
     * @return {SPDataItems | undefined}
     */
    public get items(): SPDataItems | undefined {
        if (this._items === undefined && this._sp !== undefined && this._graph !== undefined) {
            this._items = new SPDataItems(this._sp, this._graph);
        }
        return this._items;
    }

    /**
     * Istanzio classe SPDataFiles solo se necessaria - Lazy loading
     * @this {SPDataService}
     * @return {SPDataFiles | undefined}
     */
    public get files(): SPDataFiles | undefined {
        if (this._files === undefined && this._sp !== undefined && this._graph !== undefined) {
            this._files = new SPDataFiles(this._sp, this._graph);
        }
        return this._files;
    }

    /**
     * Istanzio classe SPDataGraph solo se necessaria - Lazy loading
     * @this {SPDataService}
     * @deprecated Utilizzare items al posto di graphLib
     * @return {SPDataGraph | undefined}
     */
    public get graphLib(): SPDataGraph | undefined {
        if (this._graphLib === undefined && this._sp !== undefined && this._graph !== undefined) {
            this._graphLib = new SPDataGraph(this._sp, this._graph);
        }
        return this._graphLib;
    }
}