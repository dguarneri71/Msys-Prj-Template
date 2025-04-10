import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { find } from "lodash";
import {
    PrimaryButton,
    DialogFooter,
    DialogContent
} from '@fluentui/react';
import {
    DetailsList, DetailsListLayoutMode, IColumn, SelectionMode
} from "@fluentui/react/lib/DetailsList";
import { IDataService } from 'classes/services/IDataService';
import { ISPField, ISPItemVersion, LookupField } from 'classes/types';
import { formatDate } from '../../../classes/helpers/DateHelper';
import "@pnp/sp/fields";

interface IItemHistoryDialogContentProps {
    versions: Array<ISPItemVersion> | undefined;
    columns: Array<string> | undefined;
    columnDefs: Array<ISPField> | undefined;
    close: () => void;
}

/**
 * @class Classe che implementa il contenuto della dialog custom
 */
class ItemHistoryDialogContent extends React.Component<IItemHistoryDialogContentProps, {}> {
    /**
     * @constructor
     * @param props 
     */
    constructor(props: IItemHistoryDialogContentProps) {
        super(props);

        this.getStyle = this.getStyle.bind(this);
        this.fieldChanged = this.fieldChanged.bind(this);
    }

    /**
     * Verifica se sono cambiati dei valori rispetto alla versione precedente
     * @param item 
     * @param index 
     * @param column 
     * @param columnType 
     * @returns 
     */
    public fieldChanged(item?: ISPItemVersion, index?: number, column?: IColumn, columnType: string = "Text"): boolean {
        console.log("fieldChanged - item: ", item);
        if (this.props.versions !== undefined && index && column !== undefined && column.fieldName !== undefined && index < this.props.versions.length - 1) {
            const currentVersion = this.props.versions[index];
            console.log("fieldChanged - currentVersion: ", currentVersion);
            const previousVersion = this.props.versions[index - 1];
            console.log("fieldChanged - previousVersion: ", previousVersion);
            const fieldName: string = column.fieldName;
            console.log("fieldChanged - fieldName: ", fieldName);

            //const itemFound = find(currentVersion, fieldName);
            //console.log("fieldChanged - item found: ", itemFound);

            let userItem: LookupField;
            let prevUserItem: LookupField;
            let currentLkpItems: LookupField[];
            let prevLkpItems: LookupField[];

            switch (columnType) {
                case "User": //fa anceh Lookup
                    userItem = currentVersion[fieldName] as LookupField;
                    prevUserItem = previousVersion[fieldName] as LookupField;
                    if (userItem?.LookupId !== prevUserItem?.LookupId) {
                        return true;
                    }
                    return false;
                case "LookupMulti":
                    currentLkpItems = currentVersion[fieldName] as LookupField[];
                    console.log("fieldChanged - lkpItem: ", currentLkpItems);
                    prevLkpItems = previousVersion[fieldName] as LookupField[];
                    console.log("fieldChanged - currentLkpItem: ", prevLkpItems);
                    
                    if (currentLkpItems.length !== prevLkpItems.length) {
                        return true;
                    }
                    // length is the same, compare values
                    for (let i = 0; i < currentLkpItems.length; i++) {
                        if (currentLkpItems[i].LookupId !== prevLkpItems[i].LookupId) {
                            return true;
                        }
                    }
                    return false;
                default:
                    if (currentVersion[fieldName] !== previousVersion[fieldName]) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    }

    /**
     * Evidenzia i valori cambiati di una colonna
     * @param item
     * @param index 
     * @param column 
     * @param columnType 
     * @returns 
     */
    public getStyle(item?: ISPItemVersion, index?: number, column?: IColumn, columnType: string = "Text"): React.CSSProperties {
        if (this.fieldChanged(item, index, column, columnType)) {
            return {
                backgroundColor: 'yellow',
            };
        }
        return {};
    }

    /**
     * 
     * @param item 
     * @param index 
     * @param column 
     * @returns 
     */
    public onRenderDateTime(item?: ISPItemVersion, index?: number, column?: IColumn): JSX.Element {
        let result = <></>;

        if (column?.fieldName !== undefined) {
            if (item !== undefined && column.fieldName in item) {
                const dateTxt: string = formatDate(item[column.fieldName] as Date);
                result = (<div style={this.getStyle(item, index, column)}>{dateTxt}</div>);
            }
        }

        return result;
    }

    /**
     * 
     * @param item 
     * @param index 
     * @param column 
     * @returns 
     */
    public onRenderUser(item?: ISPItemVersion, index?: number, column?: IColumn): JSX.Element {
        let result: JSX.Element = <></>;
        if (column?.fieldName === undefined) {
            return result;
        }

        if (item !== undefined && column.fieldName in item) {
            if (item[column.fieldName] !== undefined || item[column.fieldName] !== null) {
                const userItem: LookupField = item[column.fieldName] as LookupField;
                if (userItem && userItem.LookupValue) {
                    result = (<div style={this.getStyle(item, index, column, "User")}>
                        {userItem.LookupValue}
                    </div>);
                }
            }
        }
        return result;
    }

    /**
     * 
     * @param item 
     * @param index 
     * @param column 
     * @returns 
     */
    public onRenderLookupMulti(item?: ISPItemVersion, index?: number, column?: IColumn): JSX.Element {
        let display = "";
        let result = <></>;

        if (item !== undefined && column?.fieldName !== undefined) {
            if (item[column.fieldName] !== undefined || item[column.fieldName] !== null) {
                const multiLookUpItems: LookupField[] = item[column.fieldName] as LookupField[];
                console.log("onRenderLookupMulti: ", multiLookUpItems)
                for (const val of multiLookUpItems) {
                    display += val.LookupValue + ";";
                }

                result = (<div style={this.getStyle(item, index, column, "LookupMulti")} >
                    {display}
                </div>);
            }
        }

        return result;
    }

    /**
     * 
     * @param item 
     * @param index 
     * @param column 
     * @returns 
     */
    public onRenderChoice(item?: ISPItemVersion, index?: number, column?: IColumn): JSX.Element {
        let result = <></>;
        if (column?.fieldName !== undefined) {
            if (item !== undefined && column.fieldName in item) {
                result = (<div style={this.getStyle(item, index, column)}>
                    {item[column.fieldName]}
                </div>);
            }
        }
        return result;
    }

    /**
     * 
     * @param item 
     * @param index 
     * @param column 
     * @returns 
     */
    public onRenderText(item?: ISPItemVersion, index?: number, column?: IColumn): JSX.Element {
        let result = <></>;

        if (column?.fieldName !== undefined) {
            //Controllo se una proprietà essite nell'interfaccia
            if (item !== undefined && column.fieldName in item) {
                result = (<div style={this.getStyle(item, index, column)}>{item[column.fieldName]}</div>);
            }
        }

        return result;
    }

    /**
     * 
     * @param item 
     * @param index 
     * @param column 
     * @returns 
     */
    public onRenderAttachments(item?: ISPItemVersion, index?: number, column?: IColumn): JSX.Element {
        let result = <></>;

        if (column?.fieldName !== undefined) {
            //Controllo se una proprietà essite nell'interfaccia
            if (item !== undefined && column.fieldName in item) {
                const value = item[column.fieldName] ? "Yes" : "No";
                result = (<div style={this.getStyle(item, index, column)}>
                    {value}
                </div>);
            }
        }

        return result;
    }

    /**
     * Renderizza il contenuto della dialog.
     * @returns 
     */
    public render(): JSX.Element {
        try {
            const _items = this.props.versions === undefined ? [] : this.props.versions;
            const _columns = this.props.columns === undefined ? [] : this.props.columns;

            const testviewFields: Array<IColumn | undefined> = _columns.map(cname => {
                const columnDef: ISPField | undefined = find(this.props.columnDefs, (colunmDef) => { return colunmDef.InternalName === cname; });
                if (columnDef !== undefined) {
                    switch (columnDef.TypeAsString) {
                        case "Attachments":
                            return {
                                name: columnDef.Title,
                                isResizable: true,
                                key: cname,
                                fieldName: cname,
                                minWidth: 100,
                                onRender: this.onRenderAttachments.bind(this)
                            };
                        case "LookupMulti":
                            return {
                                name: columnDef.Title,
                                isResizable: true,
                                key: cname,
                                fieldName: cname,
                                minWidth: 100,
                                onRender: this.onRenderLookupMulti.bind(this)
                            };
                        case "DateTime":
                            return {
                                name: columnDef.Title,
                                isResizable: true,
                                key: cname,
                                fieldName: cname,
                                minWidth: 100,
                                onRender: this.onRenderDateTime.bind(this)
                            };
                        case "Choice":
                            return {
                                name: columnDef.Title,
                                isResizable: true,
                                key: cname,
                                fieldName: cname,
                                minWidth: 100,
                                onRender: this.onRenderChoice.bind(this)
                            };
                        case "Lookup":
                        case "User":
                            return {
                                name: columnDef.Title,
                                isResizable: true,
                                key: cname,
                                fieldName: cname,
                                minWidth: 100,
                                onRender: this.onRenderUser.bind(this)
                            };
                        case "Text":
                        case "Note":
                            return {
                                name: columnDef.Title,
                                isResizable: true,
                                key: cname,
                                fieldName: cname,
                                minWidth: 100,
                                onRender: this.onRenderText.bind(this)
                            };
                        default:
                            console.log("the colum type " + columnDef.TypeAsString + " HAS NOT BEENTESTED, default to text")
                            return {
                                name: columnDef.Title,
                                isResizable: true,
                                key: cname,
                                fieldName: cname,
                                minWidth: 100,
                                onRender: this.onRenderText.bind(this)
                            };
                    }
                } else {
                    return;
                }
            });

            console.log("Render() - testviewFields: ", testviewFields);

            const cleanArray = testviewFields.filter((item): item is IColumn => item !== undefined);

            cleanArray.unshift({
                name: "Version",
                isResizable: true,
                key: "Version",
                fieldName: "VersionLabel",
                minWidth: 50
            });

            console.log("Render() - cleanArray: ", cleanArray);

            return (<DialogContent
                title='Version History(Grid)'
                onDismiss={this.props.close}
                showCloseButton={true}>
                <DetailsList
                    items={_items}
                    columns={cleanArray}
                    compact={false}
                    selectionMode={SelectionMode.none}
                    key={"ID"}
                    onShouldVirtualize={() => { return false; }}
                    layoutMode={DetailsListLayoutMode.justified}
                    skipViewportMeasures={true}
                />
                <DialogFooter>
                    <PrimaryButton text='Cancel' title='Cancel' onClick={this.props.close} />
                </DialogFooter>
            </DialogContent>);
        }
        catch (error: unknown) {
            console.log("Dialog Content Error: ", error);
            return <></>
        }
    }
}

/**
 * @class Classe che implementa una Dialog custom
 */
export default class ItemHistoryDialog extends BaseDialog {
    public itemId: number = 0;
    public listId: string = "";
    public viewId: string = "";
    public dataService: IDataService | undefined = undefined;
    public fieldInternalNames: Array<string> | undefined = [];
    public fieldDefinitions: Array<ISPField> | undefined = [];
    public versionHistory: Array<ISPItemVersion> | undefined = [];
    public spDataService?: IDataService | undefined;

    /**
     * Metodo esecuito prima dell'apertura della dialog che carica i dati inereti alla versione dell'item
     */
    public async onBeforeOpen(): Promise<void> {
        try {
            // get the fields in the view
            this.fieldInternalNames = await this.spDataService?.fields?.getViewFieldInternalNames(this.listId, this.viewId);
            console.log("onBeforeOpen - item fields InternalNames: ", this.fieldInternalNames);

            // get the field definitions for the list
            this.fieldDefinitions = await this.spDataService?.fields?.getListFields(this.listId);
            console.log("onBeforeOpen - item field Definitions: ", this.fieldDefinitions);

            // get the field versionHostory
            this.versionHistory = await this.spDataService?.items?.getItemVersions(this.listId, this.itemId);
            console.log("onBeforeOpen - item version History: ", this.versionHistory);
        }
        catch (error: unknown) {
            console.log("onBeforeOpen - error: ", error);
        }
    }

    /**
     * Renderizza la dialog usando il componente ItemHistoryDialogContent
     */
    public render(): void {
        ReactDOM.render(<ItemHistoryDialogContent
            versions={this.versionHistory}
            columns={this.fieldInternalNames}
            columnDefs={this.fieldDefinitions}
            close={this.close}
        />,
            this.domElement);
    }

    public getConfig(): IDialogConfiguration {
        return {
            isBlocking: false
        };
    }

    protected onDispose(): void {
        ReactDOM.unmountComponentAtNode(this.domElement);
    }
}