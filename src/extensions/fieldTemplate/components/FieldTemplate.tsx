import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';
import { stringIsNullOrEmpty } from "@pnp/core";
import styles from './FieldTemplate.module.scss';

export interface IFieldTemplateProps {
  text: string;
}

const LOG_SOURCE: string = 'FieldTemplate';

export default class FieldTemplate extends React.Component<IFieldTemplateProps, {}> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FieldTemplate mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FieldTemplate unmounted');
  }

  public render(): React.ReactElement<{}> {
    const value: string = stringIsNullOrEmpty(this.props.text) ? "0" : this.props.text;
    return (
      <div className={styles.fieldTemplate}>
        <div className={styles.full}>
          <div style={{ width: (value) + "px", background: "#ff0000", color: "#000" }}>
            &nbsp; {value}%
          </div>
        </div>
      </div>
    );
  }
}
