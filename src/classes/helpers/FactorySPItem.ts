import { TSPItem } from "../dto/TSPItem";

export class FactorySPItem {
    static createObject<T extends U, U>(tipo: new () => T, values: TSPItem): T {
        const oggetto = new tipo();
        console.log("OGGETTO: ", oggetto);
        return this.fillProperties(oggetto, values);
    }

    static fillProperties<T>(
        obj: T,
        valori: TSPItem
    ): T {
        console.log("VALORI: ", valori);
        const chiavi = Object.keys(obj as unknown as object) as (keyof T)[];
        console.log("CHIAVI: ", chiavi);

        chiavi.forEach(chiave => {
            if (chiave in valori) {
                obj[chiave] = valori[chiave as string] as unknown as T[keyof T];
            }
        });

        return obj;
    }
}