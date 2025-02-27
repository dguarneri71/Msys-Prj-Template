import { SPDataLists } from "./lists/SPDataLists";

//Interfaccia utilizzata per le classi che lavorano con i dati
export interface IDataService {
    lists: SPDataLists; //proprietà che definisce una nuova classe con i metodi per lavoreare con
}