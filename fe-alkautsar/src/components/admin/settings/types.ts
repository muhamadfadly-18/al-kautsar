export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserFormState = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
};
