export interface Character {
  id: number;
  name: string;
  element: number; // element id
  weapon: number; // weapon type id
  imgUrl: string;

  // UI
  elementName?: string; // add `?`: the field can be null
  weaponName?: string;
}

export interface UploadImageReq {
  blob: string;
  name: string;
}
