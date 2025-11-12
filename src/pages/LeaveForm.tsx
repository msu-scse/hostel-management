import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaveRequestSchema, LeaveRequestFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function LeaveForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const onSubmit = (data: LeaveRequestFormData) => {
    console.log('Leave request data:', data);
    toast({
      title: 'Leave request submitted',
      description: 'Your leave request has been submitted for approval.',
    });
    navigate('/leaves');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apply for Leave</h1>
        <p className="text-muted-foreground">Submit a leave request</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed reason for your leave request" 
                        rows={6} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit">Submit Request</Button>
                <Button type="button" variant="outline" onClick={() => navigate('/leaves')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
