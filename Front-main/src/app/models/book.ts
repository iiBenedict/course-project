export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn?: string;
  publishedYear?: number;
  status: 'Available' | 'Borrowed';
  language?: string;
  country?: string;
  pages?: number;
  imageLink?: string;
  link?: string;
}
