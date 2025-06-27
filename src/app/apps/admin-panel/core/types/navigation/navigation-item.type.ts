import { generateUUID } from "@core/utils/generate-uuid/generate-uuid";
import { BaseItem } from "../base-item/base-item.interface";

type NavigationItemType = 'section' | 'itemWithIcon' | 'item';


export class NavigationItem extends BaseItem {
  public type: NavigationItemType;
  public label: string;
  public icon?: string;
  public children?: NavigationItem[];
  public hidden?: boolean | (() => boolean);
  public route?: string;

  constructor(params: {
    type: NavigationItem['type'];
    label: NavigationItem['label'];
    icon?: NavigationItem['icon'];
    children?: NavigationItem['children'];
    hidden?: NavigationItem['hidden'];
    route?: NavigationItem['route'];
  }) {
    super();
    this.type = params.type;
    this.label = params.label;
    this.icon = params.icon;
    this.children = params.children;
    this.hidden = params.hidden;
    this.route = params.route;
  }

  public isHidden(): boolean {
    if (typeof this.hidden === 'function') {
      return this.hidden();
    }
    return this.hidden ?? false;
  }
}
