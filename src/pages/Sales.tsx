import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, TrendingUp, Download, DollarSign, ShoppingCart, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Sale {
  id: string;
  pharmacy: string;
  date: string;
  items: number;
  total: number;
  payment: 'paid' | 'pending' | 'partial';
  method: 'cash' | 'credit' | 'bank-transfer';
}

const mockSales: Sale[] = [
  { id: 'INV-001', pharmacy: 'City Pharmacy', date: '2025-10-28', items: 8, total: 2500, payment: 'paid', method: 'bank-transfer' },
  { id: 'INV-002', pharmacy: 'Health Plus', date: '2025-10-28', items: 5, total: 1800, payment: 'pending', method: 'credit' },
  { id: 'INV-003', pharmacy: 'MediCare', date: '2025-10-27', items: 12, total: 3200, payment: 'paid', method: 'cash' },
  { id: 'INV-004', pharmacy: 'Wellness Pharmacy', date: '2025-10-27', items: 6, total: 1500, payment: 'partial', method: 'bank-transfer' },
  { id: 'INV-005', pharmacy: 'City Pharmacy', date: '2025-10-26', items: 10, total: 2800, payment: 'paid', method: 'credit' },
];

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    pharmacy: '',
    items: '',
    total: '',
    method: 'cash' as 'cash' | 'credit' | 'bank-transfer',
  });

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.pharmacy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = filterPayment === 'all' || sale.payment === filterPayment;
    return matchesSearch && matchesPayment;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSale: Sale = {
      id: `INV-${String(sales.length + 1).padStart(3, '0')}`,
      pharmacy: formData.pharmacy,
      date: new Date().toISOString().split('T')[0],
      items: parseInt(formData.items),
      total: parseFloat(formData.total),
      payment: 'paid',
      method: formData.method,
    };
    
    setSales([newSale, ...sales]);
    toast.success('Sales order created successfully!');
    setDialogOpen(false);
    setFormData({ pharmacy: '', items: '', total: '', method: 'cash' });
  };

  const getPaymentBadge = (payment: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      partial: 'bg-orange-100 text-orange-700',
    };
    return styles[payment as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Sales Management</h1>
          <p className="text-gray-600">Create and manage sales orders</p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Sale
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-gray-900">{sales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-gray-900">${sales.reduce((acc, s) => acc + s.total, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-gray-900">{sales.filter(s => s.payment === 'paid').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-gray-900">{sales.filter(s => s.payment === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="text-blue-600">{sale.id}</TableCell>
                    <TableCell>{sale.pharmacy}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.items}</TableCell>
                    <TableCell>${sale.total.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{sale.method.replace('-', ' ')}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentBadge(sale.payment)}>
                        {sale.payment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
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
            <DialogTitle>Create Sales Order</DialogTitle>
            <DialogDescription>
              Create a new sales invoice for a pharmacy customer
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                    <SelectItem value="Wellness Pharmacy">Wellness Pharmacy</SelectItem>
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
                <Label htmlFor="total">Total Amount ($)</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select 
                  value={formData.method} 
                  onValueChange={(value: 'cash' | 'credit' | 'bank-transfer') => setFormData({ ...formData, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600">
                Create Sale
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
