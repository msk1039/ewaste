'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RequestStatusHistory from '@/app/components/RequestStatusHistory';

interface RequestDetail {
  request_id: number;
  waste_type: string;
  description: string;
  date_submitted: string;
  date_resolved: string | null;
  status: string;
  service_area: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
}

export default function RequestDetailsPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/requests/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch request details');
        }
        
        const data = await response.json();
        setRequest(data.request);
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching request details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4 mt-20">Loading...</div>;
  }

  if (error || !request) {
    return (
      <div className="container mx-auto p-4 mt-20">
        <div className="text-red-500">Error: {error || 'Request not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Request #{request.request_id}</CardTitle>
                  <CardDescription>Submitted on {new Date(request.date_submitted).toLocaleDateString()}</CardDescription>
                </div>
                <Badge variant={
                  request.status === 'completed' ? 'outline' :
                  request.status === 'processing' ? 'secondary' :
                  request.status === 'rejected' ? 'destructive' :
                  request.status === 'approved' ? 'outline' :
                  'default'
                } className={
                  request.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                  request.status === 'processing' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                  ''
                }>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Waste Type</h3>
                  <p>{request.waste_type}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                  <p>{request.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Service Area</h3>
                  <p>{request.service_area}</p>
                </div>

                {request.date_resolved && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Date Resolved</h3>
                    <p>{new Date(request.date_resolved).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Status History - Added from our trigger-powered component */}
          <div className="mt-6">
            <RequestStatusHistory requestId={Number(id)} />
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Donor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                  <p>{request.donor_name}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <p>{request.donor_email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Phone</h3>
                  <p>{request.donor_phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}