import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, Edit, AlertTriangle, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Medicine {
  id: string;
  name: string;
  category: string;
  company: string;
  stock: number;
  price: number;
  expiry: string;
  status: 'in-stock' | 'low-stock' | 'expiring-soon' | 'out-of-stock';
}

const mockMedicines: Medicine[] = [
  { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Pain Relief', company: 'PharmaCorp', stock: 450, price: 2.50, expiry: '2026-06-15', status: 'in-stock' },
  { id: 'MED-002', name: 'Amoxicillin 250mg', category: 'Antibiotics', company: 'MediSupply', stock: 85, price: 5.75, expiry: '2025-12-20', status: 'low-stock' },
  { id: 'MED-003', name: 'Ibuprofen 400mg', category: 'Pain Relief', company: 'Global Pharma', stock: 320, price: 3.20, expiry: '2026-03-10', status: 'in-stock' },
  { id: 'MED-004', name: 'Omeprazole 20mg', category: 'Digestive', company: 'MedTech', stock: 15, price: 4.50, expiry: '2025-11-05', status: 'expiring-soon' },
  { id: 'MED-005', name: 'Metformin 500mg', category: 'Diabetes', company: 'PharmaCorp', stock: 0, price: 6.80, expiry: '2026-01-30', status: 'out-of-stock' },
  { id: 'MED-006', name: 'Aspirin 75mg', category: 'Cardiovascular', company: 'Global Pharma', stock: 520, price: 1.90, expiry: '2026-08-12', status: 'in-stock' },
  { id: 'MED-007', name: 'Ciprofloxacin 500mg', category: 'Antibiotics', company: 'MediSupply', stock: 68, price: 7.25, expiry: '2025-11-15', status: 'low-stock' },
  { id: 'MED-008', name: 'Vitamin D3 1000IU', category: 'Vitamins', company: 'MedTech', stock: 280, price: 8.50, expiry: '2026-09-25', status: 'in-stock' },
];

export default function Inventory() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    company: '',
    stock: '',
    price: '',
    expiry: '',
  });

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || medicine.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['Pain Relief', 'Antibiotics', 'Vitamins', 'Diabetes', 'Cardiovascular', 'Digestive'];

  const handleOpenDialog = (medicine?: Medicine) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        name: medicine.name,
        category: medicine.category,
        company: medicine.company,
        stock: medicine.stock.toString(),
        price: medicine.price.toString(),
        expiry: medicine.expiry,
      });
    } else {
      setEditingMedicine(null);
      setFormData({ name: '', category: '', company: '', stock: '', price: '', expiry: '' });
    }
    setDialogOpen(true);
  };

  const getStatus = (stock: number, expiry: string): Medicine['status'] => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 100) return 'low-stock';
    
    const expiryDate = new Date(expiry);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 30) return 'expiring-soon';
    return 'in-stock';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stock = parseInt(formData.stock);
    const status = getStatus(stock, formData.expiry);
    
    if (editingMedicine) {
      setMedicines(medicines.map(m => 
        m.id === editingMedicine.id ? { 
          ...m, 
          ...formData,
          stock,
          price: parseFloat(formData.price),
          status
        } : m
      ));
      toast.success('Medicine updated successfully!');
    } else {
      const newMedicine: Medicine = {
        id: `MED-${String(medicines.length + 1).padStart(3, '0')}`,
        ...formData,
        stock,
        price: parseFloat(formData.price),
        status,
      };
      setMedicines([...medicines, newMedicine]);
      toast.success('Medicine added successfully!');
    }
    
    setDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'in-stock': 'bg-green-100 text-green-700',
      'low-stock': 'bg-orange-100 text-orange-700',
      'expiring-soon': 'bg-yellow-100 text-yellow-700',
      'out-of-stock': 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || styles['in-stock'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track and manage medicine stock levels</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <p className="text-gray-900">{medicines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-gray-900">{medicines.filter(m => m.status === 'low-stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-gray-900">{medicines.filter(m => m.status === 'expiring-soon').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-gray-900">{medicines.filter(m => m.status === 'out-of-stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>{medicine.id}</TableCell>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>{medicine.company}</TableCell>
                    <TableCell>
                      <span className={medicine.stock < 100 ? 'text-orange-600' : ''}>
                        {medicine.stock}
                      </span>
                    </TableCell>
                    <TableCell>${medicine.price.toFixed(2)}</TableCell>
                    <TableCell>{medicine.expiry}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(medicine.status)}>
                        {medicine.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(medicine)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
            <DialogDescription>
              {editingMedicine ? 'Update medicine information' : 'Enter medicine details to add to inventory'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600">
                {editingMedicine ? 'Update' : 'Add'} Medicine
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
