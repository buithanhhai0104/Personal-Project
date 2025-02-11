export interface IUser {
  id: number;
  name: string;
  ngay_tao: string;
  email: string;
  username: string;
  password?: string;
  role: string;
}
