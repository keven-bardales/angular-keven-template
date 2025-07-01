import { BaseItem } from "app/apps/admin-panel/core/types/base-item/base-item.type";

export class AppUser extends BaseItem {
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;


  constructor(obj: {
    fullName: AppUser['fullName'];
    email: AppUser['email'];
    role: AppUser['role'];
    phoneNumber: AppUser['phoneNumber'];
  }) {
    super();
    this.fullName = obj.fullName;
    this.email = obj.email;
    this.role = obj.role;
    this.phoneNumber = obj.phoneNumber;
  }

}
