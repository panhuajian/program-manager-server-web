export interface Monitor {
  code: string;
  name: string;
  id: number;
}

export interface BasicListItemDataType {
  id: number;
  createTime: string;
  filePath: string;
  masked: boolean;
  maskedWarning: boolean;
  monitor: Monitor;
  temperature: number;
  temperatureWarning: boolean;
}
