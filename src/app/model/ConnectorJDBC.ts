import { Connector } from "./Connector";
import { QueryMode } from "./Enum";

export class ConnectorJDBC extends Connector{
  jdbcUrl?: string;
  username?: string;
  password?: string;
  className?:string;
  tableName?:string;
  initialQuery?:string;
  checkpointColumn?:string;
  incrementalVariable?:string;
  incrementalQuery?:string;
 mode?: string;
 }
