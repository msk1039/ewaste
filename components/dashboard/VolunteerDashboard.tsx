
// 'use client';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// interface VolunteerDashboardProps {
//   userId: number;
// }

// export default function VolunteerDashboard({ userId }: VolunteerDashboardProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Volunteer Dashboard</CardTitle>
//         <CardDescription>Manage your volunteer activities</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>Volunteer dashboard content will be displayed here.</p>
//       </CardContent>
//     </Card>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Calendar, BookOpen, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface VolunteerDashboardProps {
  userId: number;
}

interface ProgramInfo {
  program_id: number;
  name: string;
  description: string;
  requirements: string;
  start_date: string;
  end_date: string;
}

interface EducationalContent {
  content_id: number;
  title: string;
  description: string;
  upload_date: string;
}

export default function VolunteerDashboard({ userId }: VolunteerDashboardProps) {
  const [programInfo, setProgramInfo] = useState<ProgramInfo | null>(null);
  const [educationalContent, setEducationalContent] = useState<EducationalContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch volunteer program info
        const programRes = await fetch(`/api/volunteers/${userId}/program`);
        if (!programRes.ok) throw new Error("Failed to load program information");
        const programData = await programRes.json();
        
        // Fetch educational content
        const contentRes = await fetch('/api/educational-content');
        if (!contentRes.ok) throw new Error("Failed to load educational content");
        const contentData = await contentRes.json();

        setProgramInfo(programData.program);
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
        {/* Volunteer Program Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Calendar className="mr-2 h-5 w-5" />
              Your Recycling Program
            </CardTitle>
            <CardDescription>
              Information about your assigned recycling program
            </CardDescription>
          </CardHeader>
          <CardContent>
            {programInfo ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{programInfo.name}</h3>
                  <p className="text-muted-foreground">{programInfo.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(programInfo.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(programInfo.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">You are not currently assigned to any program.</p>
            )}
          </CardContent>
          {programInfo && (
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/volunteer/program/${programInfo.program_id}`}>
                  View Program Details
                </Link>
              </Button>
            </CardFooter>
          )}
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

      {/* Impact Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Your Impact
          </CardTitle>
          <CardDescription>
            How your volunteer work is making a difference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Impact statistics are coming soon. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}