import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download } from 'lucide-react';
import feeService from '@/lib/feeService';
import { Fee } from '@/types';
import { useNavigate, Link } from 'react-router-dom';

const currency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function Fees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await feeService.getFees();
      if (!mounted) return;
      setFees(data);
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Delete fee record?');
    if (!ok) return;
    const success = await feeService.deleteFee(id);
    if (success) setFees(await feeService.getFees());
  };

  const handleMarkPaid = async (id: string) => {
    await feeService.markFeePaid(id);
    setFees(await feeService.getFees());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fees</h1>
          <p className="text-muted-foreground">Manage fee records and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/fees/new')}>
            <Plus className="mr-2 h-4 w-4" /> New Fee
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Due</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0">
                    <td className="py-4">{f.studentName}</td>
                    <td className="py-4 capitalize">{f.type}</td>
                    <td className="py-4">{currency(f.amount)}</td>
                    <td className="py-4">{new Date(f.dueDate).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Badge variant={f.status === 'paid' ? 'outline' : 'secondary'} className="capitalize">{f.status}</Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <Link to={`/fees/${f.id}/edit`}>View / Edit</Link>
                        </Button>
                        {f.status !== 'paid' && (
                          <Button size="sm" onClick={() => handleMarkPaid(f.id)}>Mark Paid</Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(f.id)}>Delete</Button>
                      </div>
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
