import { TSPItem } from "../dto/TSPItem";

export class FactorySPItem {
    //Metodo che restituisce un oggetto valorizzato che implementa una certa interfaccia
    // U: interfaccia usata da modello
    // T: l'oggetto
    // Values: i valori da assegnare all'oggetto
    static createObject<U, T extends U>(tipo: new () => T, values: TSPItem): T {
        const oggetto = new tipo();
        return this.fillProperties(oggetto, values);
    }

    //Metodo per valorizzare le proprietà di un oggetto copiandole da un tipo TSPITem
    private static fillProperties<T>(obj: T, valori: TSPItem): T {
        //Notare l'uso di 'unknown' serve per dire al compilatore di fidarsi che stiamo cercando di convertire un oggetto
        const chiavi = Object.keys(obj as unknown as object) as (keyof T)[];

        chiavi.forEach(chiave => {
            if (chiave in valori) {
                obj[chiave] = valori[chiave as string] as unknown as T[keyof T];
            }
        });

        return obj;
    }
}