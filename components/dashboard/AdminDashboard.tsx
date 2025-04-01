// 'use client';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// interface AdminDashboardProps {
//   userId: number;
// }

// export default function AdminDashboard({ userId }: AdminDashboardProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Admin Dashboard</CardTitle>
//         <CardDescription>Manage the e-waste recycling platform</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>Admin dashboard content will be displayed here.</p>
//       </CardContent>
//     </Card>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, PlusCircle, Users, BarChart, BookOpen } from "lucide-react";
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
  donor_name: string;
  donor_email: string;
  donor_phone: string;
}

interface AdminDashboardProps {
  userId: number;
}

export default function AdminDashboard({ userId }: AdminDashboardProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all requests
        const requestsRes = await fetch('/api/requests');
        if (!requestsRes.ok) throw new Error("Failed to load donation requests");
        const requestsData = await requestsRes.json();
        
        setRequests(requestsData.requests);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Analytics Card */}
        <Card className="hover:shadow-md transition-shadow">
          <Link href="/admin/analytics" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <BarChart className="mr-2 h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                View e-waste collection statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track donation metrics, recycling statistics, and more.
              </p>
            </CardContent>
          </Link>
        </Card>

        {/* Educational Content Management */}
        <Card className="hover:shadow-md transition-shadow">
          <Link href="/admin/educational-content" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <BookOpen className="mr-2 h-5 w-5" />
                Educational Content
              </CardTitle>
              <CardDescription>
                Manage educational resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and update educational content about e-waste management.
              </p>
            </CardContent>
          </Link>
        </Card>

        {/* Recycling Program Management */}
        <Card className="hover:shadow-md transition-shadow">
          <Link href="/admin/programs" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Users className="mr-2 h-5 w-5" />
                Recycling Programs
              </CardTitle>
              <CardDescription>
                Manage recycling programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create, edit and manage recycling programs and volunteer assignments.
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Donation Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Recent Donation Requests
          </CardTitle>
          <CardDescription>
            Manage pending and recent e-waste donation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of recent donation requests</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.slice(0, 5).map((request) => (
                  <TableRow key={request.request_id}>
                    <TableCell className="font-medium">{request.request_id}</TableCell>
                    <TableCell>{request.donor_name}</TableCell>
                    <TableCell>{request.waste_type}</TableCell>
                    <TableCell>{new Date(request.date_submitted).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/requests/${request.request_id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No donation requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" asChild>
            <Link href="/admin/requests">View All Requests</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}