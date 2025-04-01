'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Types for our analytics data
interface StatusData {
  status: string;
  count: number;
}

interface WasteTypeData {
  waste_type: string;
  count: number;
}

interface ServiceAreaData {
  service_area: string;
  count: number;
}

interface TrendsData {
  month: string;
  count: number;
}

interface ProgramData {
  name: string;
  start_date: string;
  end_date: string;
  volunteer_count: number;
}

interface EWasteConditionData {
  condition: string;
  count: number;
}

interface EWasteTypeData {
  type: string;
  count: number;
}

interface DonorTypeData {
  donor_type: string;
  count: number;
}

interface FeedbackData {
  average_rating: number;
  feedback_count: number;
}

interface ProcessingData {
  avg_processing_days: number;
}

export default function AnalyticsPage() {
  // State for each data type
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [wasteTypeData, setWasteTypeData] = useState<WasteTypeData[]>([]);
  const [serviceAreaData, setServiceAreaData] = useState<ServiceAreaData[]>([]);
  const [trendsData, setTrendsData] = useState<TrendsData[]>([]);
  const [programData, setProgramData] = useState<ProgramData[]>([]);
  const [ewasteConditionData, setEwasteConditionData] = useState<EWasteConditionData[]>([]);
  const [ewasteTypeData, setEwasteTypeData] = useState<EWasteTypeData[]>([]);
  const [donorTypeData, setDonorTypeData] = useState<DonorTypeData[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [processingData, setProcessingData] = useState<ProcessingData | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all');

  // Colors for charts
  const statusColors = {
    'pending': '#FFC107',
    'approved': '#2196F3',
    'processing': '#9C27B0',
    'completed': '#4CAF50',
    'rejected': '#F44336'
  };

  const conditionColors = {
    'new': '#4CAF50',
    'used': '#2196F3',
    'damaged': '#F44336'
  };

  const donorTypeColors = {
    'individual': '#2196F3',
    'business': '#9C27B0',
    'organization': '#4CAF50'
  };

  // Generic colors for other charts
  const chartColors = [
    '#2196F3', '#4CAF50', '#F44336', '#FFC107', '#9C27B0',
    '#00BCD4', '#FF5722', '#3F51B5', '#E91E63', '#009688'
  ];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Fetch all analytics data in parallel
        const [
          statusRes,
          wasteTypeRes,
          serviceAreaRes,
          trendsRes,
          programsRes,
          ewasteConditionRes,
          ewasteTypeRes,
          donorTypeRes,
          feedbackRes,
          processingRes
        ] = await Promise.all([
          fetch(`/api/analytics/requests-by-status?timeRange=${timeRange}`),
          fetch(`/api/analytics/requests-by-waste-type?timeRange=${timeRange}`),
          fetch(`/api/analytics/requests-by-service-area?timeRange=${timeRange}`),
          fetch(`/api/analytics/donation-trends?timeRange=${timeRange}`),
          fetch('/api/analytics/program-statistics'),
          fetch('/api/analytics/ewaste-by-condition'),
          fetch('/api/analytics/ewaste-by-type'),
          fetch('/api/analytics/donors-by-type'),
          fetch(`/api/analytics/feedback-ratings?timeRange=${timeRange}`),
          fetch(`/api/analytics/processing-efficiency?timeRange=${timeRange}`)
        ]);

        // Handle any fetch errors
        if (!statusRes.ok) throw new Error("Failed to load status data");
        if (!wasteTypeRes.ok) throw new Error("Failed to load waste type data");
        if (!serviceAreaRes.ok) throw new Error("Failed to load service area data");
        if (!trendsRes.ok) throw new Error("Failed to load trends data");
        if (!programsRes.ok) throw new Error("Failed to load program data");
        if (!ewasteConditionRes.ok) throw new Error("Failed to load e-waste condition data");
        if (!ewasteTypeRes.ok) throw new Error("Failed to load e-waste type data");
        if (!donorTypeRes.ok) throw new Error("Failed to load donor type data");
        if (!feedbackRes.ok) throw new Error("Failed to load feedback data");
        if (!processingRes.ok) throw new Error("Failed to load processing efficiency data");

        // Parse JSON responses
        const status = await statusRes.json();
        const wasteType = await wasteTypeRes.json();
        const serviceArea = await serviceAreaRes.json();
        const trends = await trendsRes.json();
        const programs = await programsRes.json();
        const ewasteCondition = await ewasteConditionRes.json();
        const ewasteType = await ewasteTypeRes.json();
        const donorType = await donorTypeRes.json();
        const feedback = await feedbackRes.json();
        const processing = await processingRes.json();

        // Update state with fetched data
        setStatusData(status.data);
        setWasteTypeData(wasteType.data);
        setServiceAreaData(serviceArea.data);
        setTrendsData(trends.data);
        setProgramData(programs.data);
        setEwasteConditionData(ewasteCondition.data);
        setEwasteTypeData(ewasteType.data);
        setDonorTypeData(donorType.data);
        setFeedbackData(feedback.data);
        setProcessingData(processing.data);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics data");
        console.error("Analytics data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare data for the status chart
  const statusChartData = {
    labels: statusData.map(item => item.status),
    datasets: [
      {
        label: 'Requests',
        data: statusData.map(item => item.count),
        backgroundColor: statusData.map(item => statusColors[item.status as keyof typeof statusColors] || '#999'),
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the waste type chart
  const wasteTypeChartData = {
    labels: wasteTypeData.map(item => item.waste_type),
    datasets: [
      {
        label: 'Waste Types',
        data: wasteTypeData.map(item => item.count),
        backgroundColor: chartColors.slice(0, wasteTypeData.length),
      },
    ],
  };

  // Prepare data for trends chart
  const trendsChartData = {
    labels: trendsData.map(item => {
      const [year, month] = item.month.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Donations',
        data: trendsData.map(item => item.count),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Prepare data for e-waste condition chart
  const ewasteConditionChartData = {
    labels: ewasteConditionData.map(item => item.condition),
    datasets: [
      {
        label: 'E-Waste Condition',
        data: ewasteConditionData.map(item => item.count),
        backgroundColor: ewasteConditionData.map(
          item => conditionColors[item.condition as keyof typeof conditionColors] || '#999'
        ),
      },
    ],
  };

  // Prepare data for donor type chart
  const donorTypeChartData = {
    labels: donorTypeData.map(item => item.donor_type),
    datasets: [
      {
        label: 'Donor Types',
        data: donorTypeData.map(item => item.count),
        backgroundColor: donorTypeData.map(
          item => donorTypeColors[item.donor_type as keyof typeof donorTypeColors] || '#999'
        ),
      },
    ],
  };

  // Prepare data for service area chart
  const serviceAreaChartData = {
    labels: serviceAreaData.map(item => item.service_area),
    datasets: [
      {
        label: 'Service Areas',
        data: serviceAreaData.map(item => item.count),
        backgroundColor: chartColors.slice(0, serviceAreaData.length),
      },
    ],
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donation Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of e-waste donation data and program performance.
          </p>
        </div>
        <div className="w-[200px]">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Range</SelectLabel>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Donations</CardTitle>
            <CardDescription>Overall donation requests processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {statusData.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-sm text-muted-foreground mt-2 flex gap-2 flex-wrap">
              {statusData.map(item => (
                <Badge 
                  key={item.status} 
                  style={{
                    backgroundColor: statusColors[item.status as keyof typeof statusColors] + '20',
                    color: statusColors[item.status as keyof typeof statusColors],
                    border: `1px solid ${statusColors[item.status as keyof typeof statusColors]}`
                  }}
                  variant="outline"
                >
                  {item.status}: {item.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Programs</CardTitle>
            <CardDescription>Currently running recycling programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {programData.filter(p => {
                const today = new Date();
                const endDate = new Date(p.end_date);
                return endDate >= today;
              }).length}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              of {programData.length} total programs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Processing Efficiency</CardTitle>
            <CardDescription>Average days to process donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {processingData?.avg_processing_days?.toFixed(1) || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              days from submission to completion
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="donations">Donation Analysis</TabsTrigger>
          <TabsTrigger value="ewaste">E-Waste Analysis</TabsTrigger>
          <TabsTrigger value="programs">Program Performance</TabsTrigger>
          <TabsTrigger value="donors">Donor Demographics</TabsTrigger>
        </TabsList>
        
        {/* Donation Analysis Tab */}
        <TabsContent value="donations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donations by Status</CardTitle>
                <CardDescription>Distribution of requests by current status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart 
                  data={statusChartData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>Monthly donation volume over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart 
                  data={trendsChartData} 
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Donations by Service Area</CardTitle>
                <CardDescription>Distribution of donations across different service areas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={serviceAreaChartData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    },
                    indexAxis: serviceAreaData.length > 6 ? 'y' as const : 'x' as const,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* E-Waste Analysis Tab */}
        <TabsContent value="ewaste" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>E-Waste by Type</CardTitle>
                <CardDescription>Distribution of e-waste by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={wasteTypeChartData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    },
                    indexAxis: wasteTypeData.length > 6 ? 'y' as const : 'x' as const,
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>E-Waste by Condition</CardTitle>
                <CardDescription>Distribution by new, used, or damaged</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart 
                  data={ewasteConditionChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detailed E-Waste Types</CardTitle>
                <CardDescription>Top 10 most common e-waste types received</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>E-waste types and their quantities</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Share (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ewasteTypeData.map((item) => {
                      const totalEwaste = ewasteTypeData.reduce((sum, i) => sum + i.count, 0);
                      const percentage = ((item.count / totalEwaste) * 100).toFixed(1);
                      
                      return (
                        <TableRow key={item.type}>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                          <TableCell className="text-right">{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Program Performance Tab */}
        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recycling Program Performance</CardTitle>
              <CardDescription>Active programs and their volunteer engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of recycling programs</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Volunteers</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programData.map((program) => {
                    const today = new Date();
                    const startDate = new Date(program.start_date);
                    const endDate = new Date(program.end_date);
                    
                    let status;
                    if (today < startDate) {
                      status = "Upcoming";
                    } else if (today > endDate) {
                      status = "Completed";
                    } else {
                      status = "Active";
                    }
                    
                    return (
                      <TableRow key={program.name}>
                        <TableCell className="font-medium">{program.name}</TableCell>
                        <TableCell>{new Date(program.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(program.end_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{program.volunteer_count}</TableCell>
                        <TableCell className="text-center"></TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              status === "Active" ? "default" :
                              status === "Upcoming" ? "outline" : "secondary"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Programs</CardTitle>
                <CardDescription>Programs currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  {programData.filter(p => {
                    const today = new Date();
                    const startDate = new Date(p.start_date);
                    const endDate = new Date(p.end_date);
                    return today >= startDate && today <= endDate;
                  }).length === 0 ? (
                    <p className="text-muted-foreground">No active programs</p>
                  ) : (
                    <PieChart
                      data={{
                        labels: programData
                          .filter(p => {
                            const today = new Date();
                            const startDate = new Date(p.start_date);
                            const endDate = new Date(p.end_date);
                            return today >= startDate && today <= endDate;
                          })
                          .map(p => p.name),
                        datasets: [
                          {
                            label: 'Volunteers',
                            data: programData
                              .filter(p => {
                                const today = new Date();
                                const startDate = new Date(p.start_date);
                                const endDate = new Date(p.end_date);
                                return today >= startDate && today <= endDate;
                              })
                              .map(p => p.volunteer_count),
                            backgroundColor: chartColors.slice(0, programData.length),
                          }
                        ]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Timeline</CardTitle>
                <CardDescription>Upcoming, active, and completed programs</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                  <div className="space-y-6 pl-10 pr-4 pb-6">
                    {programData
                      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                      .map((program, index) => {
                        const startDate = new Date(program.start_date);
                        const endDate = new Date(program.end_date);
                        const today = new Date();
                        
                        let status;
                        let color;
                        if (today < startDate) {
                          status = "Upcoming";
                          color = "bg-gray-300";
                        } else if (today > endDate) {
                          status = "Completed";
                          color = "bg-green-500";
                        } else {
                          status = "Active";
                          color = "bg-blue-500";
                        }
                        
                        return (
                          <div key={program.name} className="relative">
                            <div className={`absolute left-[-26px] w-4 h-4 rounded-full ${color} border-4 border-background`}></div>
                            <div className="mb-1 text-sm text-muted-foreground">
                              {new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}
                            </div>
                            <div className="font-medium">{program.name}</div>
                            <div className="text-sm flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  status === "Active" ? "default" :
                                  status === "Upcoming" ? "outline" : "secondary"
                                }
                              >
                                {status}
                              </Badge>
                              <span>{program.volunteer_count} volunteers</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Donor Demographics Tab */}
        <TabsContent value="donors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donor Distribution</CardTitle>
                <CardDescription>Breakdown by donor type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart 
                  data={donorTypeChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feedback Ratings</CardTitle>
                <CardDescription>Average donor satisfaction ratings</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col items-center justify-center">
                {feedbackData ? (
                  <>
                    <div className="text-6xl font-bold text-center mb-2">
                      {feedbackData.average_rating.toFixed(1)}/5
                    </div>
                    <div className="flex items-center gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div 
                          key={star}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            star <= Math.round(feedbackData.average_rating) 
                              ? 'bg-yellow-400 text-yellow-950' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {feedbackData.feedback_count} donor ratings
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No feedback data available</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Service Area Coverage</CardTitle>
                <CardDescription>Distribution of donors and requests by service area</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={{
                    labels: serviceAreaData.map(item => item.service_area),
                    datasets: [
                      {
                        label: 'Donation Requests',
                        data: serviceAreaData.map(item => item.count),
                        backgroundColor: '#2196F3',
                      }
                    ]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}