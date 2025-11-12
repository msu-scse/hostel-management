import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import feeService from '@/lib/feeService';
import { Fee } from '@/types';

type FormData = {
  studentName: string;
  amount: number;
  dueDate: string;
  type: Fee['type'];
  description: string;
  studentId?: string;
};

export default function FeeForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm<FormData>({
    defaultValues: {
      studentName: '',
      amount: 0,
      dueDate: '',
      type: 'hostel',
      description: '',
    },
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const f = await feeService.getFeeById(id);
      if (!f) return;
      form.reset({
        studentName: f.studentName,
        amount: f.amount,
        dueDate: f.dueDate,
        type: f.type,
        description: f.description,
        studentId: f.studentId,
      });
    })();
  }, [id, form]);

  const onSubmit = (data: FormData) => {
    (async () => {
      if (id) {
        await feeService.updateFee(id, {
          studentName: data.studentName,
          amount: data.amount,
          dueDate: data.dueDate,
          type: data.type,
          description: data.description,
        });
        toast({ title: 'Fee updated' });
        navigate('/fees');
        return;
      }

      const newFee: Fee = {
        id: `f_${Date.now()}`,
        studentId: data.studentId ?? '',
        studentName: data.studentName,
        amount: data.amount,
        dueDate: data.dueDate,
        status: 'pending',
        type: data.type,
        description: data.description,
      };
      await feeService.createFee(newFee);
      toast({ title: 'Fee created' });
      navigate('/fees');
    })();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{id ? 'Edit Fee' : 'Create Fee'}</h1>
        <p className="text-muted-foreground">Create or update fee records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="studentName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Rahul Kumar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="dueDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hostel">Hostel</SelectItem>
                        <SelectItem value="mess">Mess</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Fee description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex gap-4">
                <Button type="submit">{id ? 'Save' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => navigate('/fees')}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
