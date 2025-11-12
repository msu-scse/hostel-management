import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import staffService from '@/lib/staffService';
import { Staff } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export default function StaffPage() {
  const [list, setList] = useState<Staff[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const s = await staffService.getStaff();
      setList(s);
    })();
  }, []);

  const refresh = async () => {
    const s = await staffService.getStaff();
    setList(s);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this staff member?')) return;
    await staffService.deleteStaff(id);
    toast({ title: 'Staff deleted' });
    refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="text-muted-foreground">Manage wardens and other staff members.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/staff/new')}>Add Staff</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Hostel</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.position ?? '-'}</TableCell>
                  <TableCell>{s.hostel ?? '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/staff/${s.id}/edit`} className="underline">Edit</Link>
                      <button className="text-destructive" onClick={() => onDelete(s.id)}>Delete</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
