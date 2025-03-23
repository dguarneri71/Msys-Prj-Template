 //Tipo generico per un item SharePoint
 //Definisce proprietà che possono avere solo certi tipi
 export type TSPItem = {
    [property: string]: number | string | Date | unknown;
 }