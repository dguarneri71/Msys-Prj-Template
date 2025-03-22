import * as React from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { IDataService } from '../../../classes/services/IDataService';
import { IWebPartTemplateState } from './IWebPartTemplateState';
import { CommandBar, ICommandBarItemProps, IconButton, IIconProps } from '@fluentui/react';
import { Dialog } from '@microsoft/sp-dialog';
//import { ITaskItem } from '../../../classes/dto/ITaskItem';
import { ISPTaskItem } from '../../../classes/dto/ISPTaskItem';
//import { TaskItem } from '../../../classes/dto/TaskItem';
//import { TaskItemObj } from '../../../classes/dto/TaskItemObj';
import { formatDate } from '../../../classes/helpers/DateHelper';
import { TSPItem } from '../../../classes/dto/TSPItem';
import { ITaskItem } from '../../../classes/dto/ITaskItem';
import { FactorySPItem } from '../../../classes/helpers/FactorySPItem';
import { TaskItem } from '../../../classes/dto/TaskItem';
import { ITaskItem2 } from '../../../classes/dto/ITaskItem2';


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
      name: "ProjectName",
      displayName: "Project Name",
      maxWidth: 100
    },
    {
      name: "Modified",
      maxWidth: 150,
      render: (rowitem: ISPTaskItem) => {
        const value = formatDate(rowitem.Modified, "it-IT", true);
        return <span>{value}</span>;
      }
    },
    {
      name: "",
      sorting: false,
      maxWidth: 40,
      render: (rowitem: ISPTaskItem) => {
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
    try {
      this.spService?.items?.getItems<ISPTaskItem>(this.props.listName).then((items: ISPTaskItem[]) => {
        console.log("_onLoadItems - Items count: ", items.length);
        this.setState({
          items: items
        });
      }).catch(reason => {
        console.log("_onLoadItems - error: ", reason);
      });
    }
    catch (error: unknown) {
      console.log("_onLoadItems - error: ", error);
    }
  }

  private _onCreate(): void {
    const date: Date = new Date();
    const data = {
      Title: "TEST New - " + date.toDateString(),
      ProjectName: "TEST DG aggiunta"
    }
    this.spService?.items?.addItem<ISPTaskItem>(this.props.listName, data).then((item: ISPTaskItem) => {
      this._onLoadItems();
    }).catch(reason => {
      console.log("_onCreate - error: ", reason);
    });
  }

  private _onGetItems(): void {
    this.spService?.items?.getItems<TSPItem>(this.props.listName).then(async (items) => {
      let message: string = "Nessun items caricato";
      if (items && items.length > 0) {
        const item: TSPItem = items[0]
        message = JSON.stringify(item, null, 2);
        console.log("_onGetItems - item: ", message);
        console.log("_onGetItems - property ProjectName value: ", item.ProjectName);
        console.log("_onGetItems - property DG_NumericTest value: ", item.DG_NumericTest ?? "Valore vuoto")
        const objTask: ITaskItem2 = new TaskItem();
        console.log("_onGetItems - oggetto task nuovo: ", objTask);
        const task: ITaskItem = FactorySPItem.createObject<TaskItem, ITaskItem2>(TaskItem, item);
        console.log("_onGetItems - oggetto task: ", task);
      }
      await Dialog.alert(message);
    }).catch((reason: unknown) => {
      console.log("_onGetItems - error type: ", typeof reason);
    });
  }

  private _getSelection(items: ISPTaskItem[]): void {
    console.log('_getSelection - Selected items:', items);
  }

  private async _onDelete(item: ISPTaskItem): Promise<void> {
    console.log('_onDelete - Selected item for delete:', item);
    try {
      await this.spService?.items?.deleteItem(this.props.listName, item);
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

  private async _onEdit(item: ISPTaskItem): Promise<void> {
    console.log('_onEdit - Selected item for edit:', item);
    const data = {
      Title: "TEST Modifica",
      ProjectName: "TEST DG modifica"
    }
    try {
      await this.spService?.items?.updateItem(this.props.listName, item, data);
      this._onLoadItems();
    } catch (error: unknown) {
      console.log("_onEdit - error: ", error);
    }
  }

  private async _onView(item: ISPTaskItem): Promise<void> {
    console.log('Selected item for edit:', item);
    try {
      const task = await this.spService?.items?.getItem<ISPTaskItem>(this.props.listName, item);
      console.log("_onView - project name: ", task?.ProjectName); //Proprietà di ITaskItem
      console.log("_onView - modified: ", task?.Modified); //Proprietà di ISPItem
    } catch (error: unknown) {
      console.log("_onView - error: ", error);
    }
  }
}