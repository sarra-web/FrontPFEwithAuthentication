import { Field } from "./FieldDAO";

export class Connector {
  typeConnector?:string
  id?:string;
  name?:string;
  fields: Field[] = [];
  published?: boolean;


 }
