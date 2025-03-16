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
        <div className={styles.full}>
          <div style={{width: (this.props.text)+"px", background:"#0094ff", color:"#c0c0c0"}}>
            &nbsp; ${this.props.text}
          </div>
        </div>
        {/*{this.props.text}*/}
      </div>
    );
  }
}
