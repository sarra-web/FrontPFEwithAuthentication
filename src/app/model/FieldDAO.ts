import { Type } from "./Enum";

export class Field {

id?:number
name?:string
position?: number;
meta?: string;
partOfDocumentIdentity?: boolean;
included?: boolean;
fieldType?:string;
content?:string[]
constructor(values: string[]) {
  this.content = values;
}

}
