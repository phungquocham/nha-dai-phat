export namespace UserProfile {
  let fuid: string;
  let id: string;
  let name: string;
  let role: string;
  let allowCopyText: boolean;
  let valueCopyText: string;

  export function setProfile(data: any) {
    fuid = data.fuid;
    id = data.id;
    name = data.name;
    role = data.role;
  }

  export function getUserName() {
    return name;
  }

  export function getUserId() {
    return id;
  }

  export function getRole() {
    return role;
  }

  export function copyText(data: ICopyText) {
    allowCopyText = data.allow;
    valueCopyText = data.value;
  }

  export function checkCopyText() {
    return {
      allow: allowCopyText,
      value: valueCopyText
    };
  }

  export function clearCopyText() {
    allowCopyText = false;
    valueCopyText = '';
  }
}

interface ICopyText {
  allow: boolean;
  value: string;
}
