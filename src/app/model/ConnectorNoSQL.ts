import { Connector } from "./Connector";
import { Field } from "./FieldDAO";

export class ConnectorNoSQL extends Connector{

  connectionString?:string ;
  dbName?:string ;
  collectionName?:string ;


 }
