import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockLeaveRequests } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function MyLeaves() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user?.id;
  const leaves = mockLeaveRequests.filter((l) => l.studentId === studentId);

  const getStatusColor = (status: typeof mockLeaveRequests[number]['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Leaves</h1>
          <p className="text-muted-foreground">View and manage your leave requests</p>
        </div>
        <Button onClick={() => navigate('/leaves/new')}>
          <Plus className="mr-2 h-4 w-4" /> Apply for Leave
        </Button>
      </div>

      <div className="space-y-4">
        {leaves.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No leave requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You haven't applied for any leaves yet.</p>
            </CardContent>
          </Card>
        )}

        {leaves.map((leave) => (
          <Card key={leave.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}</CardTitle>
                    <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Requested on {new Date(leave.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{leave.reason}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
