import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import staffService from '@/lib/staffService';
import { Staff } from '@/types';
import { useToast } from '@/hooks/use-toast';

type FormData = {
  name: string;
  email: string;
  phone?: string;
  role: Staff['role'];
  position?: string;
  hostel?: string;
};

export default function StaffForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    defaultValues: { name: '', email: '', phone: '', role: 'other', position: '', hostel: '' },
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const s = await staffService.getStaffById(id);
      if (!s) return;
      form.reset({ name: s.name, email: s.email, phone: s.phone, role: s.role, position: s.position, hostel: s.hostel });
    })();
  }, [id, form]);

  const onSubmit = (data: FormData) => {
    (async () => {
      if (id) {
        await staffService.updateStaff(id, data);
        toast({ title: 'Staff updated' });
        navigate('/staff');
        return;
      }

      const newStaff: Staff = {
        id: `st_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        position: data.position,
        hostel: data.hostel,
      };
      await staffService.createStaff(newStaff);
      toast({ title: 'Staff created' });
      navigate('/staff');
    })();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{id ? 'Edit Staff Member' : 'Add Staff Member'}</h1>
        <p className="text-muted-foreground">Create or edit staff (warden, mess staff, etc.)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warden">Warden</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="hostel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostel</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex gap-4">
                <Button type="submit">{id ? 'Save' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => navigate('/staff')}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
