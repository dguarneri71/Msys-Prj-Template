import * as React from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IItem } from '@pnp/sp/items';
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { IDataService } from '../../../classes/services/IDataService';
import { IWebPartTemplateState } from './IWebPartTemplateState';
import { CommandBar, ICommandBarItemProps, IconButton, IIconProps } from '@fluentui/react';

const deleteIcon: IIconProps = { iconName: 'Delete' };
const editIcon: IIconProps = { iconName: 'Edit' };

export default class WebPartTemplate extends React.Component<IWebPartTemplateProps, IWebPartTemplateState> {
  private spService: IDataService;

  private viewFields: IViewField[] = [
    {
      name: "Title",
      maxWidth: 200
    },
    {
      name: 'Id',
      maxWidth: 50
    },
    {
      name: "ProjectName",
      maxWidth: 200
    },
    {
      name: "",
      sorting: false,
      maxWidth: 40,
      render: (rowitem: IItem) => {
        const buttons = <div>
          <IconButton iconProps={deleteIcon} onClick={async () => { await this._onDelete(rowitem) }} title="Delete" ariaLabel="delete" />
          <IconButton iconProps={editIcon} onClick={async () => { await this._onEdit(rowitem) }} title="Edit" ariaLabel="edit" />
        </div>;
        return buttons;
      }
    }
  ];

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
    this.spService.items.getItems(this.props.listName).then((items: IItem[]) => {
      console.log("Items count:", items.length);
      this.setState({
        items: items
      });
    }).catch(reason => {
      console.log(reason);
    });
  }

  private _onCreate(): void {
    const date: Date = new Date();
    const data = {
      Title: "TEST New - " + date.toDateString(),
      ProjectName: "TEST DG aggiunta"
    }
    this.spService.items.addItem(this.props.listName, data).then((item: IItem) => {
      this.spService.items.getItems(this.props.listName).then((items: IItem[]) => {
        this.setState({
          items: items
        });
      }).catch(reason => {
        console.log(reason);
      });
    }).catch(reason => {
      console.log(reason);
    });
  }

  private _getSelection(items: IItem[]): void {
    console.log('Selected items:', items);
  }

  private async _onDelete(item: any): Promise<void> {
    console.log('Selected item for delete:', item);
    try {
      await this.spService.items.deleteItem(this.props.listName, item.id as number);
      this.setState({
        items: await this.spService.items.getItems(this.props.listName)
      });
    } catch (e) {
      console.log(e);
    }
  }

  private async _onEdit(item: any): Promise<void> {
    console.log('Selected item for edit:', item);
    const data = {
      Title: "TEST Modifica",
      ProjectName: "TEST DG modifica"
    }
    try {
      await this.spService.items.updateItem(this.props.listName, item.Id as number, data);
      this.setState({
        items: await this.spService.items.getItems(this.props.listName)
      });
    } catch (e) {
      console.log(e);
    }
  }
}