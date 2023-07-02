import { Connector } from "./Connector";
import { Field } from "./FieldDAO";

export class ConnectorCSV extends Connector{

  separator?:string;
  encoding?:string;
  path?:string ;
  quotingCaracter?:string ;
  escapingCaracter?:string;
  containsHeaders?:boolean;


 }
