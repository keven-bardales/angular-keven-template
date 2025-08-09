export interface ErrorItem {
  type: string;
  code: string;
  message: string;
  field?: string;
  critical: boolean;
}