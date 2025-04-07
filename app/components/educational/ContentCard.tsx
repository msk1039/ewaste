import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { EducationalContent } from "@/types/educational";
import { Eye } from "lucide-react";

interface ContentCardProps {
  content: EducationalContent;
}

export default function ContentCard({ content }: ContentCardProps) {
  // Format date to be more readable
  const formattedDate = format(new Date(content.upload_date), "MMMM d, yyyy");
  
  // Truncate description for preview
  const truncatedDescription = 
    content.description.length > 150 
      ? `${content.description.substring(0, 150)}...` 
      : content.description;

  // Format view count
  const viewCount = content.view_count || 0;

  return (
    <Link href={`/educational-content/${content.content_id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-green-400">
        <CardHeader className="bg-green-50 pb-2">
          <CardTitle className="text-xl font-medium text-green-800">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-600">{truncatedDescription}</p>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 pt-0 flex justify-between items-center">
          <span>Published on {formattedDate}</span>
          <span className="flex items-center gap-1 text-gray-600">
            <Eye className="h-4 w-4" /> {viewCount/2}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}