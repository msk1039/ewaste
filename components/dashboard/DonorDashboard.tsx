'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, PlusCircle, BookOpen, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

interface Request {
  request_id: number;
  waste_type: string;
  description: string;
  date_submitted: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  service_area: string;
}

interface EducationalContent {
  content_id: number;
  title: string;
  description: string;
  upload_date: string;
}

interface DonorDashboardProps {
  userId: number;
}

export default function DonorDashboard({ userId }: DonorDashboardProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [educationalContent, setEducationalContent] = useState<EducationalContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch donor's requests
        const requestsRes = await fetch(`/api/requests/donor/${userId}`);
        if (!requestsRes.ok) throw new Error("Failed to load donation requests");
        const requestsData = await requestsRes.json();
        
        // Fetch educational content
        const contentRes = await fetch('/api/educational-content');
        if (!contentRes.ok) throw new Error("Failed to load educational content");
        const contentData = await contentRes.json();

        setRequests(requestsData.requests);
        setEducationalContent(contentData.content);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Approved</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            {error}. Please try refreshing the page.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Donation Request Card */}
        <Card className="hover:shadow-md transition-shadow">
          <Link href="/requests/new" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Donation Request
              </CardTitle>
              <CardDescription>
                Submit a new e-waste donation request for recycling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Help reduce e-waste by donating your old electronics. Fill out a simple form to get started.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Create Request</Button>
            </CardFooter>
          </Link>
        </Card>

        {/* Educational Content Card */}
        <Card className="hover:shadow-md transition-shadow">
          <Link href="/educational-content" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <BookOpen className="mr-2 h-5 w-5" />
                Educational Resources
              </CardTitle>
              <CardDescription>
                Learn about e-waste management and recycling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {educationalContent.slice(0, 2).map((content) => (
                  <div key={content.content_id} className="p-3 border rounded-md">
                    <div className="font-medium">{content.title}</div>
                    <div className="text-sm text-gray-500 truncate">{content.description}</div>
                  </div>
                ))}
                {educationalContent.length === 0 && (
                  <p className="text-muted-foreground">No educational content available yet.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View All Resources</Button>
            </CardFooter>
          </Link>
        </Card>
      </div>

      {/* Past Donation Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Your Donation History
          </CardTitle>
          <CardDescription>
            Track the status of your e-waste donation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent donation requests</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Service Area</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow key={request.request_id}>
                    <TableCell className="font-medium">{request.request_id}</TableCell>
                    <TableCell>{request.waste_type}</TableCell>
                    <TableCell>{new Date(request.date_submitted).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">{request.service_area || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    You haven't made any donation requests yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" asChild>
            <Link href="/requests/history">View Complete History</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}