import { ITaskItem2 } from "./ITaskItem2";

export class TaskItem implements ITaskItem2 {
    ProjectName: string | undefined = undefined;
    StarDate: Date | undefined = undefined;
    EndDate: Date | undefined = undefined;
    TaskDetails: string | undefined = undefined;
    NumericTest: number | undefined = undefined;
    DG_NumericTest: number | undefined = undefined;
    Percent: number | undefined = undefined;
    Id: number = 0;
    Title: string | undefined = undefined;
    Modified: Date = new Date();
    Created: Date = new Date();
    Author: string = "";
    Editor: string = "";
}