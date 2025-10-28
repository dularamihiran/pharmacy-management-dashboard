import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Return {
  id: string;
  invoiceId: string;
  pharmacy: string;
  date: string;
  items: number;
  amount: number;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
}

const mockReturns: Return[] = [
  { id: 'RET-001', invoiceId: 'INV-003', pharmacy: 'City Pharmacy', date: '2025-10-28', items: 2, amount: 450, reason: 'Damaged products', status: 'approved' },
  { id: 'RET-002', invoiceId: 'INV-002', pharmacy: 'Health Plus', date: '2025-10-27', items: 1, amount: 180, reason: 'Wrong item', status: 'pending' },
  { id: 'RET-003', invoiceId: 'INV-005', pharmacy: 'MediCare', date: '2025-10-26', items: 3, amount: 620, reason: 'Expired', status: 'approved' },
];

export default function SalesReturns() {
  const [returns, setReturns] = useState<Return[]>(mockReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    pharmacy: '',
    items: '',
    amount: '',
    reason: '',
  });

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ret.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ret.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReturn: Return = {
      id: `RET-${String(returns.length + 1).padStart(3, '0')}`,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      items: parseInt(formData.items),
      amount: parseFloat(formData.amount),
      status: 'pending',
    };
    
    setReturns([newReturn, ...returns]);
    toast.success('Sales return created successfully!');
    setDialogOpen(false);
    setFormData({ invoiceId: '', pharmacy: '', items: '', amount: '', reason: '' });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Sales Returns</h1>
          <p className="text-gray-600">Manage product returns and refunds</p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Return
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Returns</p>
                <p className="text-gray-900">{returns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-gray-900">{returns.filter(r => r.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-gray-900">{returns.filter(r => r.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-gray-900">${returns.reduce((acc, r) => acc + r.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Returns List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search returns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((ret) => (
                  <TableRow key={ret.id}>
                    <TableCell>{ret.id}</TableCell>
                    <TableCell className="text-blue-600">{ret.invoiceId}</TableCell>
                    <TableCell>{ret.pharmacy}</TableCell>
                    <TableCell>{ret.date}</TableCell>
                    <TableCell>{ret.items}</TableCell>
                    <TableCell>${ret.amount.toLocaleString()}</TableCell>
                    <TableCell>{ret.reason}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(ret.status)}>
                        {ret.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Sales Return</DialogTitle>
            <DialogDescription>
              Process a return for an existing sales order
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceId">Invoice Number</Label>
                <Input
                  id="invoiceId"
                  placeholder="INV-001"
                  value={formData.invoiceId}
                  onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pharmacy">Pharmacy</Label>
                <Select 
                  value={formData.pharmacy} 
                  onValueChange={(value) => setFormData({ ...formData, pharmacy: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pharmacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="City Pharmacy">City Pharmacy</SelectItem>
                    <SelectItem value="Health Plus">Health Plus</SelectItem>
                    <SelectItem value="MediCare">MediCare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Number of Items</Label>
                <Input
                  id="items"
                  type="number"
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Return Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(value) => setFormData({ ...formData, reason: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Damaged products">Damaged products</SelectItem>
                    <SelectItem value="Wrong item">Wrong item</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Quality issue">Quality issue</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600">
                Create Return
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
