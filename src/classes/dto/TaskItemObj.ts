//import { stringIsNullOrEmpty } from "@pnp/core";

export class TaskItemObj {
    key?: string;
    Id: number | undefined = undefined;
    Title: string | undefined = undefined;
    ProjectName: string | undefined = undefined;
    Modified?: Date;
    //ModifiedStr?: string; /* stringa solo per PNP ListView gestisce male gli oggetti date */
    /*get ModifiedText(): string | undefined {
        return this.Modified ? this.Modified?.toISOString() : undefined;
    }*/
}