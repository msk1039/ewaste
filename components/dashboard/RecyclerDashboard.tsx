'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Recycle, BookOpen, CheckCircle, Truck } from "lucide-react";
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

interface Assignment {
  assignment_id: number;
  request_id: number;
  waste_type: string;
  description: string;
  date_submitted: string;
  status: 'processing' | 'completed';
  donor_name: string;
  donor_phone: string;
  donor_address: string;
  service_area: string;
  assigned_date: string;
}

interface EducationalContent {
  content_id: number;
  title: string;
  description: string;
  upload_date: string;
}

interface RecyclerDashboardProps {
  userId: number;
}

export default function RecyclerDashboard({ userId }: RecyclerDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [educationalContent, setEducationalContent] = useState<EducationalContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recycler's assignments
        const assignmentsRes = await fetch(`/api/recycler/${userId}/assignments`);
        if (!assignmentsRes.ok) throw new Error("Failed to load assignments");
        const assignmentsData = await assignmentsRes.json();
        
        // Fetch educational content
        const contentRes = await fetch('/api/educational-content');
        if (!contentRes.ok) throw new Error("Failed to load educational content");
        const contentData = await contentRes.json();

        setAssignments(assignmentsData.assignments);
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
      case 'processing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMarkAsComplete = async (assignmentId: number, requestId: number) => {
    try {
      console.log("Sending request with data:", { assignmentId, requestId });
      
      const response = await fetch(`/api/recycler/complete-assignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          requestId
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.error || 'Failed to update status');
      }

      // Update the assignment status in the UI
      setAssignments(prevAssignments => 
        prevAssignments.map(assignment => 
          assignment.assignment_id === assignmentId
            ? { ...assignment, status: 'completed' as const }
            : assignment
        )
      );

      toast.success('Assignment marked as complete');
    } catch (err: any) {
      toast.error(err.message);
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
        {/* Active Assignments Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Truck className="mr-2 h-5 w-5" />
              Active E-Waste Assignments
            </CardTitle>
            <CardDescription>
              Handle these e-waste donations assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Your active e-waste processing assignments</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Waste Type</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Service Area</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length > 0 ? (
                  [...assignments]
                  .sort((a, b) => b.assignment_id - a.assignment_id)
                  .map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{assignment.request_id}</TableCell>
                    <TableCell>{assignment.waste_type}</TableCell>
                    <TableCell>{assignment.donor_name}</TableCell>
                    <TableCell>{assignment.service_area}</TableCell>
                    <TableCell>{new Date(assignment.assigned_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                      >
                      <Link href={`/recycler/assignments/${assignment.assignment_id}`}>
                        View
                      </Link>
                      </Button>
                      {assignment.status === 'processing' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
                        onClick={() => handleMarkAsComplete(assignment.assignment_id, assignment.request_id)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Complete
                      </Button>
                      )}
                    </div>
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No active assignments. Check back later for new tasks.
                  </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
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

        {/* Recycling Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Recycle className="mr-2 h-5 w-5" />
              Recycling Statistics
            </CardTitle>
            <CardDescription>
              Your recycling impact and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {assignments.length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total Assignments
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {assignments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}