export interface IUsers {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  teamId?: number;
  teamName?: string;
  id?: number;
  status?: number;
  joinedDate?: number;
  lastReportedDate?: number;
  createdAt?: number;
  createdUserId?: number;
  updatedAt?: number;
  updatedUserId?: number;
}

export class ModelUserInList implements IUsers {
  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  teamName = '';
  teamId = 0;
  role = '';
  joinedDate = 0;
  lastReportedDate = 0;
  status = 0;
  id = 0;
  constructor() {}

  getKeys(data: {
    exceptKeys?: string[]
  }) {
    const keys: string[] = Object.keys(this);
    if (data.exceptKeys && data.exceptKeys.length > 0) {
      data.exceptKeys.forEach(exceptKey => {
        const index = keys.findIndex(key => key === exceptKey);
        if (index > -1) {
          keys.splice(index, 1);
        }
      });
    }
    return keys;
  }

  getLabels() {
    return [
      'Họ',
      'Tên',
      'SĐT',
      'Email',
      'Nhóm',
      'Vai trò',
      'Ngày tham gia',
      'Lần cuối báo cáo',
      'Trạng thái',
      ''
    ];
  }
}

export class ModelUserCreate implements IUsers {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  role = '';
  teamId = 0;
  constructor() {}

  setData(data: IUsers) {
    Object.keys(data).forEach(key => {
      if (data[key]) {
        this[key] = data[key];
      }
    });
  }

  clearData() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.role = '';
    this.teamId = 0;
  }
}
