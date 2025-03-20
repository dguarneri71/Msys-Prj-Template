import { IDataService } from "../../../classes/services/IDataService";

export interface IWebPartTemplateProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  dataService: IDataService | undefined; //DG aggiunta
  listName: string //DG
}
