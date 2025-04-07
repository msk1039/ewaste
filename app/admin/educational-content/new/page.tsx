"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock admin ID - in a real app this would come from auth context
const ADMIN_ID = 1;

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(10000, "Description must not exceed 10000 characters"),
});

export default function NewEducationalContentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating educational content...");

    try {
      const response = await fetch("/api/educational-content/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          adminId: ADMIN_ID,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create content");
      }

      const result = await response.json();
      
      toast.dismiss(loadingToast);
      toast.success("Educational content created successfully!");
      
      // Redirect to content management page
      router.push("/admin/educational-content");
    } catch (error) {
      console.error("Error creating content:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to create content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/educational-content")}
        className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content Management
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl font-bold text-green-800">Create New Educational Content</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter an informative title for your content" 
                        {...field} 
                        className="focus-visible:ring-green-500"
                      />
                    </FormControl>
                    <FormDescription>
                      This title will be displayed to all users on the educational content page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your educational content here..." 
                        className="min-h-[300px] focus-visible:ring-green-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about e-waste management, recycling practices, etc.
                      You can use paragraphs to organize your content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <CardFooter className="flex justify-end px-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/educational-content")}
                  className="mr-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Content'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}