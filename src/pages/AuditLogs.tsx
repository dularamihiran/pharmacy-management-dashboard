import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Search, Activity } from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'approve';
}

const mockLogs: AuditLog[] = [
  { id: '1', user: 'Admin User', action: 'Approved Purchase Order', module: 'Purchases', details: 'PO-002 approved', timestamp: '2025-10-28 10:30', type: 'approve' },
  { id: '2', user: 'Sales Officer', action: 'Created Sales Invoice', module: 'Sales', details: 'INV-001 created for City Pharmacy', timestamp: '2025-10-28 09:15', type: 'create' },
  { id: '3', user: 'Inventory Officer', action: 'Updated Stock', module: 'Inventory', details: 'Paracetamol stock updated to 450', timestamp: '2025-10-28 08:45', type: 'update' },
  { id: '4', user: 'Procurement Officer', action: 'Created Purchase Order', module: 'Purchases', details: 'PO-003 created', timestamp: '2025-10-27 16:20', type: 'create' },
  { id: '5', user: 'Admin User', action: 'Added New Supplier', module: 'Suppliers', details: 'MedTech Solutions added', timestamp: '2025-10-27 14:10', type: 'create' },
  { id: '6', user: 'Sales Officer', action: 'Updated Payment Status', module: 'Payments', details: 'PAY-001 marked as completed', timestamp: '2025-10-27 11:30', type: 'update' },
  { id: '7', user: 'Inventory Officer', action: 'Deleted Expired Medicine', module: 'Inventory', details: 'MED-089 removed from inventory', timestamp: '2025-10-26 15:45', type: 'delete' },
  { id: '8', user: 'Admin User', action: 'Added New User', module: 'Settings', details: 'New sales officer account created', timestamp: '2025-10-26 09:00', type: 'create' },
];

export default function AuditLogs() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesModule && matchesType;
  });

  const getTypeBadge = (type: string) => {
    const styles = {
      create: 'bg-green-100 text-green-700',
      update: 'bg-blue-100 text-blue-700',
      delete: 'bg-red-100 text-red-700',
      approve: 'bg-purple-100 text-purple-700',
    };
    return styles[type as keyof typeof styles];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Audit Logs</h1>
        <p className="text-gray-600">Track system activities and user actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-gray-900">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-gray-900">{logs.filter(l => l.type === 'create').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Updated</p>
                <p className="text-gray-900">{logs.filter(l => l.type === 'update').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Deleted</p>
                <p className="text-gray-900">{logs.filter(l => l.type === 'delete').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Suppliers">Suppliers</SelectItem>
                <SelectItem value="Purchases">Purchases</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Payments">Payments</SelectItem>
                <SelectItem value="Settings">Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.module}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{log.details}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(log.type)}>
                        {log.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
