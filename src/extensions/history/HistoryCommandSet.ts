import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  //RowAccessor,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import ItemHistoryDialog from "./components/ItemHistory";
//import { Dialog } from '@microsoft/sp-dialog';
import { IDataService } from '../../classes/services/IDataService';
import SPDataService from '../../classes/services/SPDataService';
import "@pnp/sp/items";
import '@pnp/sp/items';
//import { IItemVersion } from '@pnp/sp/items';
//import { isInteger } from 'lodash';

/**
 * Guarda questo esempio
 * https://github.com/pnp/sp-dev-fx-webparts/blob/main/samples/react-item-History
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHistoryCommandSetProperties {}

const LOG_SOURCE: string = 'HistoryCommandSet';

export default class HistoryCommandSet extends BaseListViewCommandSet<IHistoryCommandSetProperties> {
  private _dataService: IDataService | undefined = undefined;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized HistoryCommandSet');

    // initial state of the command's visibility
    const historyCommand: Command = this.tryGetCommand('COMMAND_History');
    historyCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    this._dataService = new SPDataService(this.context.serviceScope);
    console.log("dataService: ", this._dataService);

    return Promise.resolve();
  }

  public async onExecute(event: IListViewCommandSetExecuteEventParameters): Promise<void> {
    switch (event.itemId) {
      case 'COMMAND_History': {
        const dialog: ItemHistoryDialog = new ItemHistoryDialog();
        dialog.itemId = event.selectedRows[0].getValueByName("ID");
        dialog.listId = this.context.pageContext.list?.id.toString() || "";
        dialog.viewId = this.context.pageContext.legacyPageContext.viewId;
        dialog.spDataService = this._dataService;
        dialog.show()
          .then(() => {
            console.log(LOG_SOURCE + " - show dialog: ");
          })
          .catch((e: Error) => {
            console.log(LOG_SOURCE + " - error: ", e);
          });
        break;
      }
      default: {
        throw new Error('Unknown command');
      }
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const historyCommand: Command = this.tryGetCommand('COMMAND_History');
    if (historyCommand) {
      // This command should be hidden unless exactly one row is selected.
      historyCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}
