import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';

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
    return (
      <div className={styles.fieldTemplate}>
        { this.props.text }
      </div>
    );
  }
}
