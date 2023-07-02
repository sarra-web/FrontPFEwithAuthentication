import { Connector } from "./Connector";

export class ConnectorJDBC extends Connector{

  jdbcUrl?: string;
  username?: string;
  password?: string;
  className?:string
 tableName?:string;



 }
