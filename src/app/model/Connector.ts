import { Field } from "./FieldDAO";

export class Connector {
  typeConnector?:string
  id?:string;
  name?:string;
  fields: Field[] = [];
  projectName?:string;
  published?: boolean;
  userId?:number;


 }
