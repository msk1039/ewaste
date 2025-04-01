'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import DonorDashboard from '@/components/dashboard/DonorDashboard';
import VolunteerDashboard from '@/components/dashboard/VolunteerDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">E-Waste Management</CardTitle>
            <CardDescription>
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role!== 'admin'){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Access Denied</CardTitle>
            <CardDescription>
              Only admins can access this dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">E-Waste Management Dashboard</h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">Welcome, {user.name}!</p>
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
        
        {/* {user.role === 'donor' && <DonorDashboard userId={user.id} />}
        {user.role === 'volunteer' && <VolunteerDashboard userId={user.id} />} */}
        {user.role === 'admin' && <AdminDashboard userId={user.id} />}
      </div>
    </div>
  );
}