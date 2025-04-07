'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

type StatusHistoryItem = {
  history_id: number;
  request_id: number;
  old_status: string | null;
  new_status: string;
  change_date: string;
};

export default function RequestStatusHistory({ requestId }: { requestId: number }) {
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/requests/${requestId}/history`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch status history');
        }
        
        const data = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching request history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchStatusHistory();
    }
  }, [requestId]);

  if (loading) {
    return <div className="text-center p-4">Loading history...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Status History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground">No status changes recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Previous Status</TableHead>
                <TableHead>New Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.history_id}>
                  <TableCell>
                    {format(new Date(item.change_date), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {item.old_status ? (
                      <span className="capitalize">{item.old_status}</span>
                    ) : (
                      <span className="text-muted-foreground italic">Initial state</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-medium">{item.new_status}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}