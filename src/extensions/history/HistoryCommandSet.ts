import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  RowAccessor,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import { IDataService } from '../../classes/services/IDataService';
import SPDataService from '../../classes/services/SPDataService';
import "@pnp/sp/items";
import '@pnp/sp/items';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHistoryCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'HistoryCommandSet';

export default class HistoryCommandSet extends BaseListViewCommandSet<IHistoryCommandSetProperties> {
  private _dataService: IDataService | undefined = undefined;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized HistoryCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_History');
    compareOneCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    this._dataService = new SPDataService(this.context.serviceScope);
    console.log("dataService: ", this._dataService);

    return Promise.resolve();
  }

  public async onExecute(event: IListViewCommandSetExecuteEventParameters): Promise<void> {
    //const sitRelativeUrl: string = "/sites/CorsoSPFX";
    switch (event.itemId) {
      case 'COMMAND_History': {
        const item: RowAccessor = event.selectedRows[0];
        console.log("onExecute - item: ", item);
        console.log("onExecute - item id: ", item.getValueByName("ID"));
        console.log("onExecute - item FileRef: ", decodeURI(item.getValueByName("FileRef")));
        console.log("onExecute - item FileLeafRef: ", item.getValueByName("FileLeafRef"));
        
        const FileLeafRef: string = item.getValueByName("FileLeafRef");
        const DocLibUrl: string = decodeURI(item.getValueByName("FileRef"));
        const relUrl: string = DocLibUrl.replace("/" + FileLeafRef, "").replace("https://"+ this._dataService?.graphLib?.sharepointHostName, "");
        console.log("onExecute - item relative url: ", relUrl);

        //await this._dataService?.graphLib?.getHistory(relUrl, item.getValueByName("ID") as number, sitRelativeUrl);
        const versions: any = await this._dataService?.items?.getItemVersions("Documents", item.getValueByName("ID") as number);
        console.log("onExecute - item versions: ", versions);

        if(versions !== undefined){
          for (const version of versions) {
            console.log("onExecute - item version: ", version);
            const txtVersion: string = JSON.stringify(version, null, 2);
            await Dialog.alert(`${txtVersion}`).catch(() => {
              /* handle error */
            });
          }
        }
        
        break;
      }
      default: {
        throw new Error('Unknown command');
      }
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand: Command = this.tryGetCommand('COMMAND_History');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}
