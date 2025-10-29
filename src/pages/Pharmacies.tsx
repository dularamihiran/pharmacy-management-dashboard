import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { Plus, Search, Edit, Store, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Pharmacy {
  id: string;
  name: string;
  owner: string;
  contact: string;
  email: string;
  address: string;
  active: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

const mockPharmacies: Pharmacy[] = [
  { id: 'PHR-001', name: 'City Pharmacy', owner: 'John Smith', contact: '+1-555-0101', email: 'city@pharmacy.com', address: '123 Main St, NY', active: true, totalOrders: 45, totalSpent: 125000, lastOrder: '2025-10-27' },
  { id: 'PHR-002', name: 'Health Plus', owner: 'Sarah Johnson', contact: '+1-555-0102', email: 'health@plus.com', address: '456 Oak Ave, CA', active: true, totalOrders: 32, totalSpent: 89000, lastOrder: '2025-10-26' },
  { id: 'PHR-003', name: 'MediCare', owner: 'Mike Brown', contact: '+1-555-0103', email: 'info@medicare.com', address: '789 Pine Rd, TX', active: true, totalOrders: 58, totalSpent: 156000, lastOrder: '2025-10-28' },
  { id: 'PHR-004', name: 'Wellness Pharmacy', owner: 'Lisa Davis', contact: '+1-555-0104', email: 'wellness@pharma.com', address: '321 Elm St, FL', active: false, totalOrders: 21, totalSpent: 45000, lastOrder: '2025-09-10' },
];

export default function Pharmacies() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    contact: '',
    email: '',
    address: '',
  });

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (pharmacy?: Pharmacy) => {
    if (pharmacy) {
      setEditingPharmacy(pharmacy);
      setFormData({
        name: pharmacy.name,
        owner: pharmacy.owner,
        contact: pharmacy.contact,
        email: pharmacy.email,
        address: pharmacy.address,
      });
    } else {
      setEditingPharmacy(null);
      setFormData({ name: '', owner: '', contact: '', email: '', address: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPharmacy) {
      setPharmacies(pharmacies.map(p => 
        p.id === editingPharmacy.id ? { ...p, ...formData } : p
      ));
      toast.success('Pharmacy updated successfully!');
    } else {
      const newPharmacy: Pharmacy = {
        id: `PHR-${String(pharmacies.length + 1).padStart(3, '0')}`,
        ...formData,
        active: true,
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: new Date().toISOString().split('T')[0],
      };
      setPharmacies([...pharmacies, newPharmacy]);
      toast.success('Pharmacy added successfully!');
    }
    
    setDialogOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setPharmacies(pharmacies.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
    toast.success('Pharmacy status updated!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Pharmacy Customers</h1>
          <p className="text-gray-600">Manage your pharmacy customers and their orders</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pharmacy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pharmacies</p>
                <p className="text-gray-900">{pharmacies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-gray-900">{pharmacies.filter(p => p.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-gray-900">{pharmacies.reduce((acc, p) => acc + p.totalOrders, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-gray-900">LKR {pharmacies.reduce((acc, p) => acc + p.totalSpent, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pharmacies List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search pharmacies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pharmacy Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy.id}>
                    <TableCell>{pharmacy.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-gray-400" />
                        {pharmacy.name}
                      </div>
                    </TableCell>
                    <TableCell>{pharmacy.owner}</TableCell>
                    <TableCell>{pharmacy.contact}</TableCell>
                    <TableCell>{pharmacy.email}</TableCell>
                    <TableCell>{pharmacy.totalOrders}</TableCell>
                    <TableCell>LKR {pharmacy.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={pharmacy.active}
                          onCheckedChange={() => handleToggleStatus(pharmacy.id)}
                        />
                        <Badge variant={pharmacy.active ? 'default' : 'secondary'}>
                          {pharmacy.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(pharmacy)}
                      >
                        <Edit className="w-4 h-4" />
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
            <DialogTitle>{editingPharmacy ? 'Edit Pharmacy' : 'Add New Pharmacy'}</DialogTitle>
            <DialogDescription>
              {editingPharmacy ? 'Update pharmacy information' : 'Enter pharmacy details to add them to your system'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pharmacy Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner Name</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600">
                {editingPharmacy ? 'Update' : 'Add'} Pharmacy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
