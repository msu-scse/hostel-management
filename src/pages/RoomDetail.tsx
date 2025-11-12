import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Building, Edit, Bed, Plus } from 'lucide-react';
import roomService from '@/lib/roomService';
import { mockRooms, mockStudents } from '@/lib/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  
  const [room, setRoom] = useState(() => mockRooms.find(r => r.id === id));
  const [unassignedStudents, setUnassignedStudents] = useState(() => mockStudents.filter(s => !s.roomNumber || s.roomNumber === ''));

  // refresh real data from storage
  useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await roomService.getRoomById(id || '');
      const students = await roomService.getStudents();
      if (!mounted) return;
      setRoom(r);
      setUnassignedStudents(students.filter(s => !s.roomNumber || s.roomNumber === ''));
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Room not found</h2>
        <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
      </div>
    );
  }

  const getStatusColor = (status: typeof room.status) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'occupied':
        return 'bg-primary text-primary-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      case 'reserved':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleAssignStudent = () => {
    if (!selectedStudent) return;
    (async () => {
      const res = await roomService.assignStudentToRoom(id || '', selectedStudent);
      toast({
        title: 'Student assigned',
        description: `${res.student?.name} has been assigned to room ${res.room?.number}.`,
      });
      const r = await roomService.getRoomById(id || '');
      const students = await roomService.getStudents();
      setRoom(r);
      setUnassignedStudents(students.filter(s => !s.roomNumber || s.roomNumber === ''));
      setSelectedStudent('');
    })();
  };

  const handleRemoveStudent = (studentId: string) => {
    (async () => {
      const res = await roomService.removeStudentFromRoom(id || '', studentId);
      toast({
        title: 'Student removed',
        description: `${res.student?.name} has been removed from room ${res.room?.number}.`,
      });
      const r = await roomService.getRoomById(id || '');
      const students = await roomService.getStudents();
      setRoom(r);
      setUnassignedStudents(students.filter(s => !s.roomNumber || s.roomNumber === ''));
    })();
  };

  const availableSlots = room.capacity - room.occupied;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/rooms')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Room {room.number}</h1>
            <p className="text-muted-foreground">{room.hostel}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/rooms/${id}/edit`}>
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Room
              </>
            </Link>
          </Button>
          <Select
            onValueChange={async (value) => {
              await roomService.updateRoom(id || '', { status: value as 'available' | 'occupied' | 'maintenance' | 'reserved' });
              const r = await roomService.getRoomById(id || '');
              setRoom(r);
              toast({ title: 'Status updated', description: `Room status changed to ${value}` });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={async () => {
            const ok = window.confirm('Delete this room? This cannot be undone.');
            if (!ok) return;
            const success = await roomService.deleteRoom(id || '');
            if (success) {
              toast({ title: 'Room deleted', description: 'Room has been removed.' });
              navigate('/rooms');
            } else {
              toast({ title: 'Error', description: 'Could not delete room.' });
            }
          }}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Room Info */}
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className={getStatusColor(room.status)}>
                {room.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium capitalize">{room.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Floor</span>
              <span className="font-medium">Floor {room.floor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{room.capacity} beds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Occupied</span>
              <span className="font-medium">{room.occupied} / {room.capacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Available</span>
              <span className="font-medium text-success">{availableSlots} slots</span>
            </div>
          </CardContent>
        </Card>

        {/* Current Occupants */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Occupants ({room.occupied})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {room.students && room.students.length > 0 ? (
              <div className="space-y-4">
                {room.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.enrollmentNumber}</p>
                        <p className="text-xs text-muted-foreground">{student.course}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStudent(student.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bed className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No students assigned to this room</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assign Student Section */}
      {availableSlots > 0 && room.status === 'available' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Assign Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.enrollmentNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAssignStudent} disabled={!selectedStudent}>
                Assign to Room
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {unassignedStudents.length} unassigned students available
            </p>
          </CardContent>
        </Card>
      )}

      {/* Room Layout Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Room Layout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {Array.from({ length: room.capacity }).map((_, index) => {
              const isOccupied = index < room.occupied;
              return (
                <div
                  key={index}
                  className={`p-6 border-2 rounded-lg flex flex-col items-center justify-center gap-2 ${
                    isOccupied
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted'
                  }`}
                >
                  <Bed className={`h-8 w-8 ${isOccupied ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">
                    Bed {index + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isOccupied ? 'Occupied' : 'Available'}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
