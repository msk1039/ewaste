import React from "react";
import { format } from "date-fns";
import { EducationalContent } from "@/types/educational";
import { Eye } from "lucide-react";

interface ContentDetailProps {
  content: EducationalContent;
}

export default function ContentDetail({ content }: ContentDetailProps) {
  // Format date to be more readable
  const formattedDate = content.upload_date 
    ? format(new Date(content.upload_date), "MMMM d, yyyy")
    : "Unknown date";

  // Get view count
  const viewCount = content.view_count || 0;

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-3">{content.title}</h1>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Published on {formattedDate}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            <Eye className="h-4 w-4" /> {viewCount} views
          </div>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        {/* Render content description - using white-space-pre-wrap to preserve formatting */}
        <div className="whitespace-pre-wrap">{content.description}</div>
      </div>
    </article>
  );
}