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

import "@pnp/sp/fields";
import { IDataService } from 'classes/services/IDataService';
import { ISPField, ISPItemVersion, PersonField } from 'classes/types';
import { formatDate } from '../../../classes/helpers/DateHelper';

interface IItemHistoryDialogContentProps {
    versions: Array<ISPItemVersion> | undefined;
    columns: Array<string> | undefined;
    columnDefs: Array<ISPField> | undefined;
    close: () => void;
}

class ItemHistoryDialogContent extends React.Component<IItemHistoryDialogContentProps, {}> {
    constructor(props: IItemHistoryDialogContentProps) {
        super(props);

        this.getStyle = this.getStyle.bind(this);
        this.fieldChanged = this.fieldChanged.bind(this);
    }

    public fieldChanged(item?: any, index?: number, column?: IColumn, columnType: string = "Text"): boolean {
        if (this.props.versions !== undefined && index && column !== undefined && column.fieldName !== undefined && index < this.props.versions.length - 1) {
            const currentVersion = this.props.versions[index];
            const previousVersion = this.props.versions[index - 1];
            const fieldName: string = column.fieldName;
            find(currentVersion, fieldName)
            switch (columnType) {
                case "User":
                    /*if (currentVersion[fieldName]["LookupId"] !== previousVersion[fieldName]["LookupId"]) {
                        return true;
                    }*/
                    return false;
                case "LookupMulti":
                    /*
                    if (this.props.versions[index][column.fieldName].length !== this.props.versions[index + 1][column.fieldName].length) {
                        return true;
                    }
                    // length is the same, compare values
                    for (let i = 0; i < this.props.versions[index][column.fieldName].length; i++) {
                        if (this.props.versions[index][column.fieldName][i]["LookupId"] !== this.props.versions[index + 1][column.fieldName][i]["LookupId"]) {
                            return true;
                        }
                    }*/
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

    public getStyle(item?: any, index?: number, column?: IColumn, columnType: string = "Text"): React.CSSProperties {
        if (this.fieldChanged(item, index, column, columnType)) {
            return {
                backgroundColor: 'yellow',
            };
        }
        return {};
    }

    public onRenderDateTime(item?: any, index?: number, column?: IColumn): any {
        if (column?.fieldName === undefined) {
            return <></>;
        }
        const dateTxt: string = formatDate(item[column.fieldName]);
        return (<div style={this.getStyle(item, index, column)}>{dateTxt}</div>);
    }

    public onRenderUser(item?: any, index?: number, column?: IColumn): any {
        if (column?.fieldName === undefined) {
            return <></>;
        }
        if (item[column.fieldName] !== undefined || item[column.fieldName] !== null) {
            const userItem: PersonField | undefined = item[column.fieldName];
            if (userItem && userItem.LookupValue) {
                return (<div style={this.getStyle(item, index, column, "User")}>
                    {userItem.LookupValue}
                </div>);
            }
        }
    }

    public onRenderLookupMulti(item?: any, index?: number, column?: IColumn): any {
        let display = "";
        if (column?.fieldName === undefined) {
            return <></>;
        }

        for (const val of item[column.fieldName]) {
            display += val.LookupValue + ";";
        }
        return (<div style={this.getStyle(item, index, column, "LookupMulti")}>
            {display}
        </div>);
    }

    public onRenderChoice(item?: any, index?: number, column?: IColumn): any {
        if (column?.fieldName === undefined) {
            return <></>;
        }

        return (<div style={this.getStyle(item, index, column)}>
            {item[column.fieldName]}
        </div>);
    }

    public onRenderText(item?: any, index?: number, column?: IColumn): any {
        if (column?.fieldName === undefined) {
            return <></>;
        }
        return (<div style={this.getStyle(item, index, column)}>
            {item[column.fieldName]}
        </div>);
    }

    public onRenderAttachments(item?: any, index?: number, column?: IColumn): any {
        if (column?.fieldName === undefined) {
            return <></>;
        }
        const value = item[column.fieldName] ? "Yes" : "No";
        return (<div style={this.getStyle(item, index, column)}>
            {value}
        </div>);
    }

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

export default class ItemHistoryDialog extends BaseDialog {
    public itemId: number = 0;
    public listId: string = "";
    public viewId: string = "";
    public dataService: IDataService | undefined = undefined;
    public fieldInternalNames: Array<string> | undefined = [];
    public fieldDefinitions: Array<ISPField> | undefined = [];
    public versionHistory: Array<ISPItemVersion> | undefined = [];
    public spDataService?: IDataService | undefined;

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