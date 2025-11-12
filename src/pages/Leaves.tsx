import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LeaveRequest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Leaves() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock data
  const leaves: LeaveRequest[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'Rahul Kumar',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      reason: 'Family emergency',
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Priya Sharma',
      startDate: '2024-01-18',
      endDate: '2024-01-20',
      reason: 'Medical appointment',
      status: 'approved',
      createdAt: '2024-01-12T14:30:00Z',
      approvedBy: 'Warden',
      approvedAt: '2024-01-13T09:00:00Z',
    },
    {
      id: '3',
      studentId: '3',
      studentName: 'Amit Patel',
      startDate: '2024-01-22',
      endDate: '2024-01-28',
      reason: 'Vacation',
      status: 'rejected',
      createdAt: '2024-01-10T16:45:00Z',
      approvedBy: 'Warden',
      approvedAt: '2024-01-11T11:00:00Z',
    },
  ];

  const getStatusColor = (status: LeaveRequest['status']) => {
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

  const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const summary = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === 'pending').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    rejected: leaves.filter((l) => l.status === 'rejected').length,
  };

  const isStudent = user?.role === 'student';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">
            {isStudent ? 'Apply for and manage your leave requests' : 'Manage student leave requests'}
          </p>
        </div>
        <Button onClick={() => navigate('/leaves/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Apply for Leave
        </Button>
      </div>

      {!isStudent && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{summary.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{summary.approved}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{summary.rejected}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaves.map((leave) => (
              <div key={leave.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{leave.studentName}</h3>
                    <Badge className={getStatusColor(leave.status)}>
                      <span className="mr-1">{getStatusIcon(leave.status)}</span>
                      {leave.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{leave.reason}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>From: {new Date(leave.startDate).toLocaleDateString()}</span>
                    <span>To: {new Date(leave.endDate).toLocaleDateString()}</span>
                  </div>
                  {leave.approvedBy && (
                    <p className="text-sm text-muted-foreground">
                      {leave.status === 'approved' ? 'Approved' : 'Rejected'} by {leave.approvedBy}
                    </p>
                  )}
                </div>
                {!isStudent && leave.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-success border-success hover:bg-success hover:text-success-foreground">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
