export type TaskItem =  {
    key?: string;
    Id: number;
    Title: string;
    ProjectName: string;
    Modified?: Date;
    //ModifiedStr?: string; /* stringa solo per PNP ListView gestisce male gli oggetti date */
}