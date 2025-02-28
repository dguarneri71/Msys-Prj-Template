import * as React from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IItem } from '@pnp/sp/items';

export default class WebPartTemplate extends React.Component<IWebPartTemplateProps, {}> {

  private items: IItem[] = [];
  
  //Spostare codice su un bottone
  public async componentDidMount(): Promise<void> {
    const lists = await this.props.dataService.lists.getLists();
    console.log("Lists:", lists);

    this.items = await this.props.dataService.items.getItems(this.props.listName);
    console.log("Items count:", this.items.length);
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
          TEST
        </div>
      </section>
    );
  }
}