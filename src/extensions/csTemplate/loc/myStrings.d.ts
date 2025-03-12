declare interface ICsTemplateCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CsTemplateCommandSetStrings' {
  const strings: ICsTemplateCommandSetStrings;
  export = strings;
}
