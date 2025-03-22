import { ISPItem } from "./ISPItem";

//Usata per sperimentare il factory
export interface ITaskItem2 extends ISPItem {
    ProjectName: string | undefined;
    StarDate: Date | undefined;
    EndDate: Date | undefined;
    TaskDetails: string | undefined;
    NumericTest: number | undefined;
    DG_NumericTest: number | undefined;
    Percent: number | undefined;
}