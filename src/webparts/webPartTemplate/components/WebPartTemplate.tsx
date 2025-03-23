import * as React from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { IDataService } from '../../../classes/services/IDataService';
import { IWebPartTemplateState } from './IWebPartTemplateState';
import { CommandBar, ICommandBarItemProps, IconButton, IIconProps } from '@fluentui/react';
import { Dialog } from '@microsoft/sp-dialog';
import { TSPTaskItem } from '../../../classes/dto/TSPTaskItem';
import { formatDate } from '../../../classes/helpers/DateHelper';
import { TSPItem } from '../../../classes/dto/TSPItem';
import { ITaskItem } from '../../../classes/dto/ITaskItem';
import { FactorySPItem } from '../../../classes/helpers/FactorySPItem';
import { TaskItem } from '../../../classes/dto/TaskItem';
import { ISPItem } from '../../../classes/dto/ISPItem';
import { SPItem } from '../../../classes/dto/SPItem';

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
      render: (rowitem: TSPTaskItem) => {
        const value = formatDate(rowitem.Modified, "it-IT", true);
        return <span>{value}</span>;
      }
    },
    {
      name: "",
      sorting: false,
      maxWidth: 40,
      render: (rowitem: TSPTaskItem) => {
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
      this.spService?.items?.getItems<TSPTaskItem>(this.props.listName).then((items: TSPTaskItem[]) => {
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
    this.spService?.items?.addItem<TSPTaskItem>(this.props.listName, data).then((item: TSPTaskItem) => {
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
        const task: ITaskItem = FactorySPItem.createObject<ITaskItem, TaskItem>(TaskItem, item);
        console.log("_onGetItems - oggetto task: ", task);
        console.log("_onGetItems - oggetto task: ", task.ModifiedFormatted);
      }
      await Dialog.alert(message);

      //Recupero un item da un'altra lista
      this.spService?.items?.getItems<TSPItem>("Settings").then(async (items) => {
        if (items && items.length > 0) {
          const item: TSPItem = items[0]
          const objSetting: ISPItem = FactorySPItem.createObject<ISPItem, SPItem>(SPItem, item);
          console.log("_onGetItems - oggetto setting: ", objSetting);
        }
      }).catch((reason: unknown) => {
        console.log("_onGetItems - error: ", reason);
        console.log("_onGetItems - error type: ", typeof reason);
      });
    }).catch((reason: unknown) => {
      console.log("_onGetItems - error type: ", typeof reason);
    });
  }

  private _getSelection(items: TSPTaskItem[]): void {
    console.log('_getSelection - Selected items:', items);
  }

  private async _onDelete(item: TSPTaskItem): Promise<void> {
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

  private async _onEdit(item: TSPTaskItem): Promise<void> {
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

  private async _onView(item: TSPTaskItem): Promise<void> {
    console.log('Selected item for edit:', item);
    try {
      const task = await this.spService?.items?.getItem<TSPTaskItem>(this.props.listName, item);
      console.log("_onView - project name: ", task?.ProjectName); //Proprietà di ITaskItem
      console.log("_onView - modified: ", task?.Modified); //Proprietà di ISPItem
    } catch (error: unknown) {
      console.log("_onView - error: ", error);
    }
  }
}