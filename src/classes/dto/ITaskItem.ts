//Interfaccia che rappresenta un item della lista Task
export interface ITaskItem {
    ProjectName?: string;
    StarDate?: Date;
    EndDate?: Date;
    TaskDetails?: string;
    NumericTest?: number;
    DG_NumericTest?: number;
    Percent?: number;

    //Proprietà aggiuntiva
    get ModifiedFormatted() : string;
}