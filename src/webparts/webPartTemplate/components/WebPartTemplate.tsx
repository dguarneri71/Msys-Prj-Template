import * as React from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IItem } from '@pnp/sp/items';
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { IDataService } from '../../../classes/services/IDataService';
import { IWebPartTemplateState } from './IWebPartTemplateState';
import { IconButton, IIconProps } from '@fluentui/react';

/*const groupByFields: IGrouping[] = [
  {
    name: "Title",
    order: GroupOrder.ascending
  }, {
    name: "Author",
    order: GroupOrder.descending
  }
];*/

const deleteIcon: IIconProps = { iconName: 'Delete' };



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
        return <IconButton iconProps={deleteIcon} onClick={() => { this._onDeleted(rowitem) }} title="Delete" ariaLabel="delete" />;
      }
    }
  ];

  constructor(props: IWebPartTemplateProps) {
    super(props);

    this.state = {
      items: []
    };

    this.spService = this.props.dataService;
  }

  //Spostare codice su un bottone
  public async componentDidMount(): Promise<void> {
    const lists = await this.spService.lists.getLists();
    console.log("Lists:", lists);

    const _items: IItem[] = await this.spService.items.getItems(this.props.listName);
    console.log("Items count:", _items.length);

    if (_items.length > 0) {
      console.log("Items count:", _items[0]);
    }

    this.setState({
      items: _items
    });
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
      </section>
    );
  }

  private _getSelection(items: IItem[]): void {
    //console.log('Selected items:', items);
  }

  private async _onDeleted(item: any): Promise<void> {
    console.log('Selected item:', item);
    await this.spService.items.deleteItem(this.props.listName, item.Id as number);
    this.setState({
      items: await this.spService.items.getItems(this.props.listName)
    });
  }
}