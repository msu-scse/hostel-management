import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { Student } from '@/types';

export default function Students() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const students: Student[] = [
    {
      id: '1',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@medhavi.edu',
      phone: '+91 9876543210',
      enrollmentNumber: 'MSU2024001',
      course: 'B.Tech Computer Science',
      year: 2,
      roomNumber: 'A-204',
      guardianName: 'Mr. Rajesh Kumar',
      guardianPhone: '+91 9876543211',
      address: 'Delhi, India',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@medhavi.edu',
      phone: '+91 9876543212',
      enrollmentNumber: 'MSU2024002',
      course: 'BBA',
      year: 1,
      roomNumber: 'B-105',
      guardianName: 'Mr. Amit Sharma',
      guardianPhone: '+91 9876543213',
      address: 'Mumbai, India',
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@medhavi.edu',
      phone: '+91 9876543214',
      enrollmentNumber: 'MSU2024003',
      course: 'B.Sc Physics',
      year: 3,
      roomNumber: 'A-305',
      guardianName: 'Mr. Suresh Patel',
      guardianPhone: '+91 9876543215',
      address: 'Gujarat, India',
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        <Button asChild>
          <Link to="/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Student Directory</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Enrollment</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm">{student.enrollmentNumber}</span>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-medium">{student.course}</p>
                        <p className="text-xs text-muted-foreground">Year {student.year}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline">{student.roomNumber}</Badge>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-muted-foreground">{student.phone}</span>
                    </td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/students/${student.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
