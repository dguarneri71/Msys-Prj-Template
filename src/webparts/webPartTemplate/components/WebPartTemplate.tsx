import * as React from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { IDataService } from '../../../classes/services/IDataService';
import { IWebPartTemplateState } from './IWebPartTemplateState';
import { CommandBar, ICommandBarItemProps, IconButton, IIconProps } from '@fluentui/react';
import { Dialog } from '@microsoft/sp-dialog';
import { formatDate } from '../../../classes/helpers/DateHelper';
import { ISPItem, ITask } from "../../../classes/types";
import { GetListItemsOptions } from 'classes/services/items/SPDataItems';

const deleteIcon: IIconProps = { iconName: 'Delete' };
const editIcon: IIconProps = { iconName: 'Edit' };
const viewIcon: IIconProps = { iconName: 'View' };

export default class WebPartTemplate extends React.Component<IWebPartTemplateProps, IWebPartTemplateState> {
  private spService: IDataService | undefined = undefined;

  //Elenco delle colonne mostrate dalla ListView
  private viewFields: IViewField[] = [
    {
      name: "Title",
      maxWidth: 80
    },
    {
      name: 'Id',
      maxWidth: 20
    },
    {
      name: "projectName",
      displayName: "Project Name",
      maxWidth: 100
    },
    {
      name: "Modified",
      maxWidth: 150,
      render: (rowitem: ITask) => {
        const value = formatDate(rowitem.Modified, "it-IT", true);
        return <span>{value}</span>;
      }
    },
    {
      name: "",
      sorting: false,
      maxWidth: 40,
      render: (rowitem: ITask) => {
        const buttons = <div>
          <IconButton iconProps={deleteIcon} onClick={async () => { await this._onDelete(rowitem) }} title="Delete" ariaLabel="delete" />
          <IconButton iconProps={editIcon} onClick={async () => { await this._onEdit(rowitem) }} title="Edit" ariaLabel="edit" />
          <IconButton iconProps={viewIcon} onClick={async () => { await this._onView(rowitem) }} title="View" ariaLabel="view" />
        </div>;
        return buttons;
      }
    }
  ];

  //Elenco dei comandei della Toolbar
  private _barItems: ICommandBarItemProps[] = [
    {
      key: 'load',
      text: 'Load Items',
      iconProps: { iconName: 'Refresh' },
      onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => { this._onLoadItems() }
    },
    {
      key: 'new',
      text: 'New item',
      iconProps: { iconName: 'NewFolder' },
      onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => { this._onCreate() }
    },
    {
      key: 'test',
      text: 'Get items',
      iconProps: { iconName: 'TestPlan' },
      onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => { this._onGetItems() }
    }
  ];

  constructor(props: IWebPartTemplateProps) {
    super(props);

    this.state = {
      items: []
    };

    this.spService = this.props.dataService;
  }

  public render(): React.ReactElement<IWebPartTemplateProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.webPartTemplate} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <div>
            <CommandBar
              items={this._barItems}
              ariaLabel="Items actions"
              primaryGroupAriaLabel="Items actions"
            />
          </div>
          <div>
            <ListView
              items={this.state.items}
              viewFields={this.viewFields}
              iconFieldName="FileRef"
              compact={true}
              selectionMode={SelectionMode.single}
              selection={this._getSelection}
              stickyHeader={true}
            />
          </div>
        </div>
      </section>
    );
  }

  private _onLoadItems(): void {
    //Non posso usare il coalesce nel mapping per come dichiarato, ci vuole il cadt esplicito
    this.spService?.items?.getListItems<ITask>({
      listTitle: "Tasks",
      select: ["Id", "Title", "ProjectName", "Modified"], // Controllo tipi su queste chiavi
      mapper: (item) => ({
        Id: item.Id as number,
        Title: item.Title as string, // Cast esplicito (senza any)
        projectName: item.ProjectName ? item.ProjectName as string : "",
        Modified: item.Modified ? new Date(item.Modified as string) : undefined,
      })
    }).then((items: ITask[]) => {
      console.log("_onLoadItems - Items count: ", items.length);
      this.setState({
        items: items
      });
    }).catch(reason => {
      console.log("_onLoadItems - error: ", reason);
    });
  }

  private _onCreate(): void {
    const date: Date = new Date();
    const data = {
      Title: "TEST New - " + date.toDateString(),
      ProjectName: "TEST DG aggiunta"
    }
    this.spService?.items?.addItem<ITask>({
      listTitle: this.props.listName, data: data,
      mapper: (item) => ({
        Id: item.Id as number,
        Title: item.Title as string, // Cast esplicito (senza any)
        projectName: item.ProjectName ? item.ProjectName as string : "",
        Modified: item.Modified ? new Date(item.Modified as string) : undefined,
      })
    }).then((item: ITask) => {
      console.log("_onCreate - added item: ", item);
      this._onLoadItems();
    }).catch(reason => {
      console.log("_onCreate - error: ", reason);
    });
  }

  private _onGetItems(): void {
    const optionsGetTasks: GetListItemsOptions<ITask> = {
      listTitle: this.props.listName,
      select: ["Id", "Title", "ProjectName", "Modified"], // Controllo tipi su queste chiavi
      mapper: (item) => ({
        Id: item.Id as number,
        Title: item.Title as string, // Cast esplicito (senza any)
        projectName: item.ProjectName ? item.ProjectName as string : "",
        Modified: item.Modified ? new Date(item.Modified as string) : undefined,
      })
    };
    this.spService?.items?.getListItems<ITask>(optionsGetTasks).then(async (items) => {
      let message: string = "Nessun items caricato";
      if (items && items.length > 0) {
        const task: ITask = items[0]
        message = JSON.stringify(task, null, 2);
        console.log("_onGetItems - item: ", message);
        console.log("_onGetItems - task: ", task);
        console.log("_onGetItems - task: ", task.projectName);
      }
      await Dialog.alert(message);

      //Recupero un item da un'altra lista
      const optionsGetSettings: GetListItemsOptions<ISPItem> = {
        listTitle: "Settings"
      };

      this.spService?.items?.getListItems<ISPItem>(optionsGetSettings).then(async (items) => {
        if (items && items.length > 0) {
          const item: ISPItem = items[0];
          console.log("_onGetItems - oggetto setting: ", item);
        }
      }).catch((reason: unknown) => {
        console.log("_onGetItems - error: ", reason);
        console.log("_onGetItems - error type: ", typeof reason);
      });
    }).catch((reason: unknown) => {
      console.log("_onGetItems - error type: ", typeof reason);
    });
  }

  private _getSelection(items: ITask[]): void {
    console.log('_getSelection - Selected items:', items);
  }

  private async _onDelete(item: ITask): Promise<void> {
    console.log('_onDelete - Selected item for delete:', item);
    try {
      await this.spService?.items?.deleteItem(this.props.listName, item.Id);
      this._onLoadItems();
    } catch (error: unknown) {
      if (error instanceof Error) {
        await Dialog.alert(error.message);
      }
      else {
        console.error("_onDelete - generic error: ", error);
      }
    }
  }

  private async _onEdit(item: ITask): Promise<void> {
    console.log('_onEdit - Selected item for edit:', item);
    const data = {
      Title: "TEST Modifica",
      ProjectName: "TEST DG modifica"
    }
    try {
      //Manca il mappe ma è solo per fare una prova
      const updatedItem = await this.spService?.items?.updateItem<ITask>({ listTitle: this.props.listName, id: item.Id, data: data });
      console.log('_onEdit - Updated item:', updatedItem);
      this._onLoadItems();
    } catch (error: unknown) {
      console.log("_onEdit - error: ", error);
    }
  }

  private async _onView(item: ITask): Promise<void> {
    console.log('Selected item for edit:', item);
    try {
      const task = await this.spService?.items?.getItem<ITask>({ listTitle: this.props.listName, id: item.Id });
      console.log("_onView - project name: ", task?.projectName); //Proprietà di ITaskItem
      console.log("_onView - modified: ", task?.Modified); //Proprietà di ISPItem
    } catch (error: unknown) {
      console.log("_onView - error: ", error);
    }
  }
}