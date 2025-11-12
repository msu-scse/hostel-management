import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users } from 'lucide-react';
import { Room } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function Rooms() {
  const navigate = useNavigate();
  
  // Mock data
  const rooms: Room[] = [
    { id: '1', number: 'A-101', floor: 1, capacity: 2, occupied: 2, type: 'double', status: 'occupied', hostel: 'Block A' },
    { id: '2', number: 'A-102', floor: 1, capacity: 2, occupied: 1, type: 'double', status: 'occupied', hostel: 'Block A' },
    { id: '3', number: 'A-103', floor: 1, capacity: 2, occupied: 0, type: 'double', status: 'available', hostel: 'Block A' },
    { id: '4', number: 'A-104', floor: 1, capacity: 2, occupied: 0, type: 'double', status: 'maintenance', hostel: 'Block A' },
    { id: '5', number: 'B-201', floor: 2, capacity: 3, occupied: 3, type: 'triple', status: 'occupied', hostel: 'Block B' },
    { id: '6', number: 'B-202', floor: 2, capacity: 3, occupied: 2, type: 'triple', status: 'occupied', hostel: 'Block B' },
  ];

  const getStatusColor = (status: Room['status']) => {
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

  const summary = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === 'available').length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground">Manage hostel rooms and occupancy</p>
        </div>
        <Button onClick={() => navigate('/rooms/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{summary.available}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{summary.occupied}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{summary.maintenance}</p>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Room {room.number}</CardTitle>
                <Badge className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{room.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Floor</span>
                <span className="font-medium">Floor {room.floor}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Occupancy</span>
                <span className="flex items-center gap-1 font-medium">
                  <Users className="h-4 w-4" />
                  {room.occupied}/{room.capacity}
                </span>
              </div>
              <Button variant="outline" className="w-full mt-2">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
