"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { EducationalContent } from "@/types/educational";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function EducationalContentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // const [contentId,setContentID] = useState<string | null>(null);
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function fetchContentId() {

  //     const Id = await params.id;
  //     setContentID(Id);
  //   }
  //   fetchContentId();
  // },[])

  useEffect(() => {
    async function fetchContentDetail() {
      try {
        setLoading(true);
        const contentId = await params.id;
        const response = await fetch(`/api/educational-content/${contentId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Educational content not found");
          }
          throw new Error("Failed to fetch content details");
        }
        
        const data = await response.json();
        setContent(data.content[0]);
      } catch (err) {
        setError("Failed to load content. Please try again later.");
        toast.error("Failed to load educational content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }


      fetchContentDetail();
    
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="container py-10 px-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/educational-content")}
          className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content Management
        </Button>
        <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl text-red-600 mb-2">Error</h2>
          <p className="text-red-700">{error || "Content not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/admin/educational-content")}
        className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content Management
      </Button>
      
      <Card className="max-w-4xl mx-auto mb-6">
        <CardHeader className="flex flex-row justify-between items-center bg-green-50">
          <div>
            <CardTitle className="text-2xl font-bold text-green-800">
              {content.title}
            </CardTitle>
            <div className="text-sm text-gray-500 mt-1">
              {/* Published on {format(new Date(content.upload_date), "MMMM d, yyyy")} */}
              Published on {content.upload_date}
            </div>
          </div>
          <Button 
            variant="outline"
            className="border-green-200 hover:bg-green-50 text-green-700"
            onClick={() => toast.info("Edit functionality coming soon!")}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Content
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="prose prose-green max-w-none">
            {/* Using pre-wrap to preserve formatting */}
            <div className="whitespace-pre-wrap">{content.description}</div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 text-sm text-gray-500">
          Content ID: {content.content_id} | Admin ID: {content.admin_id}
        </CardFooter>
      </Card>

      <div className="max-w-4xl mx-auto border-t pt-6 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">Preview</h3>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => router.push(`/educational-content/${content.content_id}`)}
          >
            View Public Page
          </Button>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          This is how your content appears to users on the public educational content page.
        </p>
      </div>
    </div>
  );
}