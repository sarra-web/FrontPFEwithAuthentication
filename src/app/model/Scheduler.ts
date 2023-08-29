import { Field } from "./FieldDAO";

export class Scheduler {
  id?:string;
  name?:string;
  scanMode?:string
  startsTime?:string
  cronExpression?:string
  endTime?:string
  status?: boolean;
  jobId?:string;


 }
