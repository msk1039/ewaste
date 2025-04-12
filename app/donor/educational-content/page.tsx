"use client";

import React, { useState, useEffect } from "react";
import ContentCard from "@/app/components/educational/ContentCard";
import { EducationalContent } from "@/types/educational";
import { Loader2 } from "lucide-react";

export default function EducationalContentPage() {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEducationalContent() {
      try {
        const response = await fetch("/api/educational-content");
        
        if (!response.ok) {
          throw new Error("Failed to fetch educational content");
        }
        
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError("Failed to load educational content. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEducationalContent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-600 mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Educational Resources</h1>
        <p className="text-gray-600 max-w-3xl">
          Learn more about e-waste management, recycling practices, and environmental impact through our curated educational materials.
        </p>
      </header>

      {content.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">No educational content available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <ContentCard key={item.content_id} content={item} root="donor"/>
          ))}
        </div>
      )}
    </div>
  );
}