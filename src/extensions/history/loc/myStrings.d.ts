declare interface IHistoryCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'HistoryCommandSetStrings' {
  const strings: IHistoryCommandSetStrings;
  export = strings;
}
