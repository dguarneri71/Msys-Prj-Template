
import { ISPItem, PersonField } from ".";

/**
 * Tipo che descrive un elelento della lista Tasks
 */
export interface ITask extends ISPItem {
    startDate?: Date;
    endDate?: Date;
    assignedTo?: PersonField;
    taskDetails?: string;
    projectName?: string;
}

export interface ISPField {
    Title: string;
    InternalName: string;
    TypeAsString: string;
}

export interface ISPItemVersion {
    [key: string]: unknown;
}