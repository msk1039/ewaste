"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { EducationalContent } from "@/types/educational";
import { toast } from "sonner";

// Mock admin ID - in a real app this would come from auth context
const ADMIN_ID = 1;

export default function AdminEducationalContentPage() {
  const router = useRouter();
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminContent() {
      try {
        setLoading(true);
        const response = await fetch(`/api/educational-content/admin?adminId=${ADMIN_ID}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch educational content");
        }
        
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError("Failed to load content. Please try again.");
        toast.error("Failed to load educational content");
        console.error(err);
      } finally {
        setLoading(false);
        toast.info("called procedure GetEducationalContentByAdminId(adminId)");
      }
    }

    fetchAdminContent();
  }, []);

  const handleCreateNew = () => {
    router.push("/admin/educational-content/new");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6  max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Educational Content Management</h1>
          <p className="text-gray-600">Manage your educational resources and articles</p>
        </div>
        <Button 
          onClick={handleCreateNew} 
          className="bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Content
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Content Card */}
        <Card 
          className="border-2 border-dashed border-green-200 hover:border-green-400 transition-colors cursor-pointer h-full flex flex-col justify-center items-center"
          onClick={handleCreateNew}
        >
          <CardContent className="flex flex-col items-center justify-center py-8">
            <PlusCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium text-green-700">Create New Content</h3>
            <p className="text-gray-500 text-center mt-2">
              Add new educational articles for visitors
            </p>
          </CardContent>
        </Card>

        {/* Content Cards */}
        {content.map((item) => (
          <Link key={item.content_id} href={`/admin/educational-content/${item.content_id}`}>
            <Card className="h-full hover:shadow-md transition-all hover:border-green-300">
              <CardHeader className="bg-green-50 pb-2">
                <CardTitle className="text-xl font-medium text-green-800 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600 line-clamp-3">
                  {item.description.substring(0, 150)}
                  {item.description.length > 150 ? '...' : ''}
                </p>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Published: {format(new Date(item.upload_date), "MMMM d, yyyy")}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {content.length === 0 && !loading && !error && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600">No content yet</h3>
          <p className="text-gray-500 mt-1">
            Get started by creating your first educational article
          </p>
          <Button 
            onClick={handleCreateNew} 
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Content
          </Button>
        </div>
      )}
    </div>
  );
}
