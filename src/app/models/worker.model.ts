/* eslint-disable no-unused-vars */
export enum WorkerRole {
  WORKER = 'worker',
  ADMIN = 'admin',
}

export interface Worker {
  _id?: string;
  name: string;
  age: number;
  mail: string;
  role: WorkerRole;
  location: string[] | Location[];
  businessAdministrated?: string;
  isDeleted: boolean;
  activationId?: string;
}
