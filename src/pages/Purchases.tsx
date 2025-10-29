import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, FileText, Download, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Purchase {
  id: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdBy: string;
}

const mockPurchases: Purchase[] = [
  { id: 'PO-001', supplier: 'PharmaCorp Ltd', date: '2025-10-28', items: 25, total: 12500, status: 'pending', createdBy: 'John Doe' },
  { id: 'PO-002', supplier: 'MediSupply Inc', date: '2025-10-27', items: 18, total: 8900, status: 'approved', createdBy: 'Jane Smith' },
  { id: 'PO-003', supplier: 'Global Pharma', date: '2025-10-26', items: 32, total: 15600, status: 'completed', createdBy: 'John Doe' },
  { id: 'PO-004', supplier: 'MedTech Solutions', date: '2025-10-25', items: 15, total: 7200, status: 'approved', createdBy: 'Jane Smith' },
  { id: 'PO-005', supplier: 'PharmaCorp Ltd', date: '2025-10-24', items: 22, total: 11300, status: 'rejected', createdBy: 'John Doe' },
];

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    items: '',
    total: '',
  });

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || purchase.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPurchase: Purchase = {
      id: `PO-${String(purchases.length + 1).padStart(3, '0')}`,
      supplier: formData.supplier,
      date: new Date().toISOString().split('T')[0],
      items: parseInt(formData.items),
      total: parseFloat(formData.total),
      status: 'pending',
      createdBy: 'Current User',
    };
    
    setPurchases([newPurchase, ...purchases]);
    toast.success('Purchase order created successfully!');
    setDialogOpen(false);
    setFormData({ supplier: '', items: '', total: '' });
  };

  const handleApprove = (id: string) => {
    setPurchases(purchases.map(p => 
      p.id === id ? { ...p, status: 'approved' as const } : p
    ));
    toast.success('Purchase order approved!');
  };

  const handleReject = (id: string) => {
    setPurchases(purchases.map(p => 
      p.id === id ? { ...p, status: 'rejected' as const } : p
    ));
    toast.error('Purchase order rejected!');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-blue-100 text-blue-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-green-100 text-green-700',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <Check className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />,
      completed: <Check className="w-3 h-3" />,
    };
    return icons[status as keyof typeof icons] || icons.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Purchase Orders</h1>
          <p className="text-gray-600">Manage purchase orders and supplier transactions</p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-gray-900">{purchases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-gray-900">{purchases.filter(p => p.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-gray-900">{purchases.filter(p => p.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-gray-900">LKR {purchases.reduce((acc, p) => acc + p.total, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="text-blue-600">{purchase.id}</TableCell>
                    <TableCell>{purchase.supplier}</TableCell>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.items}</TableCell>
                    <TableCell>LKR {purchase.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(purchase.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(purchase.status)}
                          {purchase.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>{purchase.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {purchase.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(purchase.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(purchase.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create PO Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order for your supplier
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select 
                  value={formData.supplier} 
                  onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PharmaCorp Ltd">PharmaCorp Ltd</SelectItem>
                    <SelectItem value="MediSupply Inc">MediSupply Inc</SelectItem>
                    <SelectItem value="Global Pharma">Global Pharma</SelectItem>
                    <SelectItem value="MedTech Solutions">MedTech Solutions</SelectItem>
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
                <Label htmlFor="total">Total Amount (LKR)</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600">
                Create Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
