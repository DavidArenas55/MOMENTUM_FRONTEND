import { Location } from "./location.model";

export interface Business {
  name: string;
  location: Location[];
  isDeleted: boolean;
  _id?: string;
}
