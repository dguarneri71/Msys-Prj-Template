import { formatDate } from "../helpers/DateHelper";
import { ITaskItem } from "./ITaskItem";
import { SPItem } from "./SPItem";

export class TaskItem extends SPItem implements ITaskItem {
    ProjectName?: string;
    StarDate?: Date;
    EndDate?: Date;
    TaskDetails?: string;
    NumericTest?: number;
    DG_NumericTest?: number;
    Percent?: number;

    constructor() {
        super();
        this.ProjectName = undefined;
        this.StarDate = undefined;
        this.EndDate = undefined;
        this.TaskDetails = undefined;
        this.NumericTest = undefined;
        this.StarDate = undefined;
        this.DG_NumericTest = undefined;
        this.Percent = undefined;
    }

    public get ModifiedFormatted() : string {
        return formatDate(this.Modified, "it-IT", true);
    }
    
}