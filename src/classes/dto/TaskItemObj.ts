//import { stringIsNullOrEmpty } from "@pnp/core";

export class TaskItemObj {
    key?: string;
    Id: number;
    Title: string;
    ProjectName: string;
    Modified?: Date;
    //ModifiedStr?: string; /* stringa solo per PNP ListView gestisce male gli oggetti date */
    get ModifiedStr(): string | undefined {
        return this.Modified ? this.Modified?.toISOString() : undefined;
    }
}