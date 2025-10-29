import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const salesData = [
  { month: 'Jan', sales: 45000, purchases: 32000, profit: 13000 },
  { month: 'Feb', sales: 52000, purchases: 38000, profit: 14000 },
  { month: 'Mar', sales: 48000, purchases: 35000, profit: 13000 },
  { month: 'Apr', sales: 61000, purchases: 42000, profit: 19000 },
  { month: 'May', sales: 55000, purchases: 40000, profit: 15000 },
  { month: 'Jun', sales: 67000, purchases: 48000, profit: 19000 },
];

const categoryPerformance = [
  { category: 'Antibiotics', sales: 45000, profit: 15000 },
  { category: 'Pain Relief', sales: 38000, profit: 12000 },
  { category: 'Vitamins', sales: 32000, profit: 11000 },
  { category: 'Diabetes', sales: 28000, profit: 9000 },
  { category: 'Cardiovascular', sales: 25000, profit: 8000 },
];

export default function Reports() {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-10-28');

  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and analyze business reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="purchases">Purchase Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex gap-2">
                <Button onClick={() => handleExport('pdf')} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={() => handleExport('excel')} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-gray-900">LKR 328,000</p>
                <p className="text-xs text-green-600 mt-1">+15.3%</p>
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
                <p className="text-sm text-gray-600">Total Purchases</p>
                <p className="text-gray-900">LKR 235,000</p>
                <p className="text-xs text-green-600 mt-1">+12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-gray-900">LKR 93,000</p>
                <p className="text-xs text-green-600 mt-1">+18.2%</p>
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
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-gray-900">28.4%</p>
                <p className="text-xs text-green-600 mt-1">+2.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Purchases vs Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} name="Sales" />
                <Line type="monotone" dataKey="purchases" stroke="#10B981" strokeWidth={2} name="Purchases" />
                <Line type="monotone" dataKey="profit" stroke="#F59E0B" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#2563EB" name="Sales" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600 mb-1">Period</p>
                <p className="text-gray-900">Jan - Jun 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-gray-900">1,234 Orders</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Order Value</p>
                <p className="text-gray-900">LKR 265.69</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Gross Sales Revenue</span>
                <span className="text-gray-900">LKR 328,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Purchase Cost</span>
                <span className="text-gray-900">LKR 235,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Operating Expenses</span>
                <span className="text-gray-900">LKR 12,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Returns & Refunds</span>
                <span className="text-red-600">-LKR 8,000</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2">
                <span className="text-gray-900">Net Profit</span>
                <span className="text-green-600 text-lg">LKR 93,000</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
