import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Edit, Trash2, User, Settings as SettingsIcon, HelpCircle, Database } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const mockUsers: SystemUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@pharma.com', role: 'admin', status: 'active' },
  { id: '2', name: 'John Procurement', email: 'john@pharma.com', role: 'procurement', status: 'active' },
  { id: '3', name: 'Sarah Sales', email: 'sarah@pharma.com', role: 'sales', status: 'active' },
  { id: '4', name: 'Mike Inventory', email: 'mike@pharma.com', role: 'inventory', status: 'active' },
];

export default function Settings() {
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'sales',
  });

  const handleOpenDialog = (user?: SystemUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'sales' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...formData } : u
      ));
      toast.success('User updated successfully!');
    } else {
      const newUser: SystemUser = {
        id: String(users.length + 1),
        ...formData,
        status: 'active',
      };
      setUsers([...users, newUser]);
      toast.success('User added successfully!');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User deleted successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Manage system configuration and users</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">
            <User className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="system">
            <SettingsIcon className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="w-4 h-4 mr-2" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="help">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button 
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
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
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="PharmaSys" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input id="companyEmail" type="email" defaultValue="contact@pharmasys.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input id="companyPhone" defaultValue="+1-234-567-8900" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input id="companyAddress" defaultValue="123 Medical Street, Healthcare City" />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-lg space-y-4">
                <h3 className="text-gray-900">Create Backup</h3>
                <p className="text-sm text-gray-600">
                  Create a complete backup of your system data including all records, settings, and configurations.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
              </div>

              <div className="p-6 border rounded-lg space-y-4">
                <h3 className="text-gray-900">Restore from Backup</h3>
                <p className="text-sm text-gray-600">
                  Restore your system from a previous backup file. This will overwrite all current data.
                </p>
                <Button variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Select Backup File
                </Button>
              </div>

              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Always create a backup before making major system changes. Backup files should be stored securely.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-gray-900 mb-2">Getting Started</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn the basics of the Pharmacy Management System and how to navigate through different modules.
                  </p>
                  <Button variant="outline" size="sm">View Guide</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-gray-900 mb-2">User Manual</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive documentation covering all features and functionalities of the system.
                  </p>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Need help? Our support team is here to assist you with any questions or issues.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">Email: support@pharmasys.com</p>
                    <p className="text-gray-600">Phone: +1-234-567-8900</p>
                    <p className="text-gray-600">Hours: Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information' : 'Create a new user account'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin / Manager</SelectItem>
                    <SelectItem value="procurement">Procurement Officer</SelectItem>
                    <SelectItem value="sales">Sales Officer</SelectItem>
                    <SelectItem value="inventory">Inventory Officer</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600">
                {editingUser ? 'Update' : 'Add'} User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
