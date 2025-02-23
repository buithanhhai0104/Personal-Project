export interface INews {
  id?: number;
  title: string;
  content: string;
  created_at: string;
  image?: string | File | null;
}
