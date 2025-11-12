import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockRooms, mockStudents } from '@/lib/mockData';
import { Link } from 'react-router-dom';

export default function MyRoom() {
  const { user } = useAuth();

  // Try to locate the student record in mock data using email or id
  const student = mockStudents.find(
    (s) => s.email === user?.email || s.id === user?.id
  );

  // If we have a student record, find their room
  const room = student
    ? mockRooms.find((r) => r.number === student.roomNumber || (r.students || []).some((st) => st.id === student.id))
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Room</h1>
          <p className="text-muted-foreground">View your room assignment and roommates</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/rooms">Browse Rooms</Link>
        </Button>
      </div>

      {!student && (
        <Card>
          <CardHeader>
            <CardTitle>No student record found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">We couldn't find a matching student record for your account. If you believe this is an error, contact your warden or admin.</p>
          </CardContent>
        </Card>
      )}

      {student && !room && (
        <Card>
          <CardHeader>
            <CardTitle>Room not assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You don't have a room assigned yet. Please contact the warden for allocation.</p>
          </CardContent>
        </Card>
      )}

      {room && (
        <Card>
          <CardHeader>
            <CardTitle>Room {room.number}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Hostel</p>
                <p className="font-medium">{room.hostel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="font-medium">{room.floor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{room.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{room.capacity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className="capitalize">{room.status}</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Roommates</h3>
              <div className="mt-2 flex flex-col gap-2">
                {(room.students || []).map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.enrollmentNumber} • {s.course}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{s.phone}</div>
                  </div>
                ))}
                {(!room.students || room.students.length === 0) && (
                  <p className="text-sm text-muted-foreground">No roommates listed for this room.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
