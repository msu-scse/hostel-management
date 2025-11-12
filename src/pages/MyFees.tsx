import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import feeService from '@/lib/feeService';
import { getDashboardStats } from '@/lib/mockData';
import { Fee } from '@/types';

const currency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function MyFees() {
  const { user } = useAuth();

  const studentId = user?.id;
  const [fees, setFees] = useState<Fee[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const all = await feeService.getFees();
      if (!mounted) return;
      setFees(all.filter((f) => f.studentId === studentId));
    })();
    return () => { mounted = false; };
  }, [studentId]);

  const pendingTotal = fees.filter((f) => f.status === 'pending').reduce((s, f) => s + f.amount, 0);

  // Fallback to dashboard stat if no fee records present
  const dashboard = user ? getDashboardStats(user.role) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Fees</h1>
          <p className="text-muted-foreground">View pending and paid fees</p>
        </div>
        <Button variant="outline">Pay Now</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fees.length ? currency(pendingTotal) : dashboard?.pendingFees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {fees.length ? (fees.find((f) => f.paidDate)?.paidDate ?? '—') : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Due</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0">
                    <td className="py-4">{f.description}</td>
                    <td className="py-4 capitalize">{f.type}</td>
                    <td className="py-4">{currency(f.amount)}</td>
                    <td className="py-4">{new Date(f.dueDate).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Badge variant={f.status === 'paid' ? 'outline' : 'secondary'} className="capitalize">
                        {f.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No fee records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
