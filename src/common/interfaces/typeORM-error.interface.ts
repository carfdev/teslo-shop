export interface TypeORMError {
  query?: string;
  parameters?: Array<string[] | number | string>;
  driverError?: TypeORMError;
  length: number;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
  name?: string;
}
