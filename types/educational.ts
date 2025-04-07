export interface EducationalContent {
  content_id: number;
  title: string;
  description: string;
  upload_date: string;
  admin_id: number;
  view_count?: number; // Optional because some legacy data might not have it
}