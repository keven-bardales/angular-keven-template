import { generateUUID } from "@core/utils/generate-uuid/generate-uuid";

export class BaseItem {
  public readonly uuid: string;

  constructor(uuid?: string) {
    this.uuid = uuid ?? generateUUID();
  }
}
