import { SPDataItems } from "./items/SPDataItems";
import { SPDataFiles } from "./files/SPDataFiles";
import { SPDataLists } from "./lists/SPDataLists";
import { SPDataGraph } from "./graphLib/SPDataGraph";

//Interfaccia utilizzata per le classi che lavorano con i dati
export interface IDataService {
    lists: SPDataLists | undefined; //proprietà che definisce una nuova classe con i metodi per lavorare con le liste
    items: SPDataItems | undefined; //proprietà che definisce una nuova classe con i metodi per lavorare con i list item
    files: SPDataFiles | undefined; //proprietà che definisce una nuova classe con i metodi per lavorare con i file
    graphLib: SPDataGraph | undefined; //proprietà che definisce una nuova classe con i metodi per lavorare con Graph
}