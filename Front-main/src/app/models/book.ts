export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publishedYear: number;
  status: 'Available' | 'Borrowed';
}
