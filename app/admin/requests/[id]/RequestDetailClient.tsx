'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Check, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Request {
  request_id: number;
  waste_type: string;
  description: string;
  date_submitted: string;
  date_resolved: string | null;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  service_area: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
}

interface Recycler {
  recycler_id: number;
  name: string;
  phone: string;
  address: string;
  service_area: string;
}

export default function RequestDetailPage({ id }: { id: string }) {
//   const { id } = params;
  const router = useRouter();
  const { user, loading } = useAuth();
  const [requestData, setRequestData] = useState<Request | null>(null);
  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [selectedRecycler, setSelectedRecycler] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestRes = await fetch(`/api/requests/get/${id}`);
        
        if (!requestRes.ok) {
          throw new Error('Failed to fetch request data');
        }
        
        const requestJson = await requestRes.json();
        setRequestData(requestJson.request);
        
        const recyclersRes = await fetch('/api/recycler/all');
        console.log("Recyclers response:", recyclersRes);
        if (!recyclersRes.ok) {
          throw new Error('Failed to fetch recyclers');
        }
        
        const recyclersJson = await recyclersRes.json();
        
        // Make sure we're actually getting an array of recyclers
        if (!recyclersJson.recyclers || !Array.isArray(recyclersJson.recyclers)) {
          console.error('Invalid recyclers data:', recyclersJson);
          setRecyclers([]);
        } else {
          setRecyclers(recyclersJson.recyclers);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        // Always set recyclers to an empty array on error
        setRecyclers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, loading, router]);
  
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
  
  const handleAssignRecycler = async () => {
    if (!selectedRecycler || !user?.id) {
      toast.error('Please select a recycler to assign');
      return;
    }
    
    try {
      setIsAssigning(true);
      
      const response = await fetch('/api/requests/assign-recycler_copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: id,
          recyclerId: selectedRecycler,
          adminId: user.id,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign recycler');
      }
      
      toast.success('Recycler assigned successfully');
      setAssignSuccess(true);
      
      if (requestData) {
        setRequestData({
          ...requestData,
          status: 'processing',
        });
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAssigning(false);
    }
  };
  
  const filteredRecyclers = recyclers?.filter(recycler => {
    // First make sure the recycler object is valid
    if (!recycler) return false;
    
    // If search query is empty, show all recyclers
    if (!searchQuery.trim()) return true;
    
    // Normalize search query
    const query = searchQuery.toLowerCase().trim();
    
    // Check if either name or service area contains the search term (OR logic)
    const nameMatch = recycler.name?.toLowerCase().includes(query) || false;
    const serviceAreaMatch = recycler.service_area?.toLowerCase().includes(query) || false;
    
    return nameMatch || serviceAreaMatch;
  }) || [];

  console.log("Recyclers data:", recyclers);
    console.log("Filtered recyclers:", filteredRecyclers);


  
  if (loading || isLoading) {
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
  
  if (!user || user.role !== 'admin') {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            You are not authorized to view this page.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (assignSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-6">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold">Recycler Assigned Successfully</h2>
        <p className="text-muted-foreground">
          A recycler has been assigned to handle this donation request.
        </p>
        <Button asChild>
          <Link href="/admin">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Donation Request Details</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      {requestData ? (
        <>
          <Card className='my-6'>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Request #{requestData.request_id}</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(requestData.date_submitted).toLocaleDateString()}
                  </CardDescription>
                </div>
                {getStatusBadge(requestData.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Donation Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Waste Type</TableCell>
                        <TableCell>{requestData.waste_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Description</TableCell>
                        <TableCell>{requestData.description}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Service Area</TableCell>
                        <TableCell>{requestData.service_area}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        <TableCell>{getStatusBadge(requestData.status)}</TableCell>
                      </TableRow>
                      {requestData.date_resolved && (
                        <TableRow>
                          <TableCell className="font-medium">Resolved On</TableCell>
                          <TableCell>{new Date(requestData.date_resolved).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">Donor Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Name</TableCell>
                        <TableCell>{requestData.donor_name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{requestData.donor_email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Phone</TableCell>
                        <TableCell>{requestData.donor_phone}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {requestData.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Assign a Recycler</CardTitle>
                <CardDescription>
                  Select a recycler to handle this donation request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="recycler-search">
                    Search recyclers
                  </label>
                  <input
                    type="text"
                    id="recycler-search"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Search by name or service area"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Service Area</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecyclers.length > 0 ? (
                        filteredRecyclers.map((recycler) => (
                          <TableRow key={recycler.recycler_id}>
                            <TableCell>
                              <input
                                type="radio"
                                name="recycler"
                                value={recycler.recycler_id}
                                checked={selectedRecycler === recycler.recycler_id}
                                onChange={() => setSelectedRecycler(recycler.recycler_id)}
                              />
                            </TableCell>
                            <TableCell>{recycler.name}</TableCell>
                            <TableCell>{recycler.phone}</TableCell>
                            <TableCell>{recycler.address}</TableCell>
                            <TableCell>{recycler.service_area}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            {searchQuery ? 'No recyclers match your search' : 'No recyclers available'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredRecyclers.length} recyclers available
                </p>
                <Button 
                  onClick={handleAssignRecycler} 
                  disabled={!selectedRecycler || isAssigning}
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Recycler'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div>Request not found</div>
        </div>
      )}
    </div>
  );
}
