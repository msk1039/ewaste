"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContentDetail from "../../components/educational/ContentDetail";
import { EducationalContent } from "@/types/educational";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EducationalContentDetailPage({ params }: { params: { id: string } }) {
  
  const router = useRouter();
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContentDetail() {
      const id = await params.id;
      try {
        // The view is automatically recorded by the API when fetching content
        const response = await fetch(`/api/educational-content/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Educational content not found");
          }
          throw new Error("Failed to fetch content details");
        }
        
        const data = await response.json();
        setContent(data.content[0]);
      } catch (err) {
        setError("Failed to load educational content. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContentDetail();
  }, [params.id]);  // Added params.id as a dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/educational-content")}
          className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Educational Resources
        </Button>
        <div className="text-center py-10">
          <h2 className="text-xl text-red-600 mb-2">Error</h2>
          <p>{error || "Content not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/educational-content")}
        className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Educational Resources
      </Button>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
        <ContentDetail content={content} />
      </div>
    </div>
  );
}