import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DoorOpen, CreditCard, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

type StatWithTrend = {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
};

type StatWithoutTrend = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

type Stat = StatWithTrend | StatWithoutTrend;

export default function Dashboard() {
  const { user } = useAuth();

  const adminStats: StatWithTrend[] = [
    { title: 'Total Students', value: '1,234', icon: Users, trend: '+12%', color: 'text-primary' },
    { title: 'Available Rooms', value: '45', icon: DoorOpen, trend: '-8%', color: 'text-secondary' },
    { title: 'Pending Fees', value: '₹2.4L', icon: CreditCard, trend: '-15%', color: 'text-accent' },
    { title: 'Open Complaints', value: '23', icon: MessageSquare, trend: '+5%', color: 'text-destructive' },
  ];

  const studentStats: StatWithoutTrend[] = [
    { title: 'Room Number', value: 'A-204', icon: DoorOpen, color: 'text-primary' },
    { title: 'Pending Fees', value: '₹12,000', icon: CreditCard, color: 'text-accent' },
    { title: 'Active Complaints', value: '2', icon: MessageSquare, color: 'text-destructive' },
    { title: 'Attendance', value: '92%', icon: TrendingUp, color: 'text-success' },
  ];

  const recentActivities = [
    { id: 1, action: 'New complaint filed', user: 'Rahul Kumar', time: '5 minutes ago', type: 'complaint' },
    { id: 2, action: 'Fee payment received', user: 'Priya Sharma', time: '1 hour ago', type: 'payment' },
    { id: 3, action: 'Leave request approved', user: 'Amit Patel', time: '2 hours ago', type: 'leave' },
    { id: 4, action: 'Room maintenance completed', user: 'Room B-305', time: '3 hours ago', type: 'maintenance' },
  ];

  const stats: Stat[] = user?.role === 'student' ? studentStats : adminStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your hostel today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {'trend' in stat && (
                <p className="text-xs text-muted-foreground">
                  <span className={stat.trend.startsWith('+') ? 'text-success' : 'text-destructive'}>
                    {stat.trend}
                  </span>{' '}
                  from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      {user?.role !== 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {activity.type === 'complaint' && <MessageSquare className="h-5 w-5 text-primary" />}
                      {activity.type === 'payment' && <CreditCard className="h-5 w-5 text-success" />}
                      {activity.type === 'leave' && <AlertCircle className="h-5 w-5 text-warning" />}
                      {activity.type === 'maintenance' && <DoorOpen className="h-5 w-5 text-info" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions for Students */}
      {user?.role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <button className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">File a Complaint</p>
                <p className="text-xs text-muted-foreground">Report an issue</p>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted">
              <CreditCard className="h-8 w-8 text-accent" />
              <div>
                <p className="font-medium">Pay Fees</p>
                <p className="text-xs text-muted-foreground">Make a payment</p>
              </div>
            </button>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {user?.role !== 'student' && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Leave requests awaiting approval</span>
                <Badge variant="outline">8 pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Complaints requiring attention</span>
                <Badge variant="outline">15 urgent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rooms needing maintenance</span>
                <Badge variant="outline">5 rooms</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
