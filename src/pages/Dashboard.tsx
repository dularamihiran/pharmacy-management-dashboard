import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Package,
  Store,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 45000, purchases: 32000 },
  { month: 'Feb', sales: 52000, purchases: 38000 },
  { month: 'Mar', sales: 48000, purchases: 35000 },
  { month: 'Apr', sales: 61000, purchases: 42000 },
  { month: 'May', sales: 55000, purchases: 40000 },
  { month: 'Jun', sales: 67000, purchases: 48000 },
];

const topMedicines = [
  { name: 'Paracetamol', sales: 450 },
  { name: 'Amoxicillin', sales: 320 },
  { name: 'Ibuprofen', sales: 280 },
  { name: 'Omeprazole', sales: 250 },
  { name: 'Metformin', sales: 210 },
];

const categoryData = [
  { name: 'Antibiotics', value: 35, color: '#2563EB' },
  { name: 'Pain Relief', value: 25, color: '#10B981' },
  { name: 'Vitamins', value: 20, color: '#F59E0B' },
  { name: 'Diabetes', value: 15, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#8B5CF6' },
];

const recentOrders = [
  { id: 'ORD-001', pharmacy: 'City Pharmacy', amount: 2500, status: 'Completed' },
  { id: 'ORD-002', pharmacy: 'Health Plus', amount: 1800, status: 'Pending' },
  { id: 'ORD-003', pharmacy: 'MediCare', amount: 3200, status: 'Completed' },
  { id: 'ORD-004', pharmacy: 'Wellness Pharmacy', amount: 1500, status: 'Processing' },
];

export default function Dashboard() {
  const { user } = useAuth();

  // Role-based stats
  const getStats = () => {
    if (user?.role === 'admin') {
      return [
        { title: 'Total Medicines', value: '1,234', icon: Package, color: 'bg-blue-500', change: '+12%' },
        { title: 'Active Pharmacies', value: '87', icon: Store, color: 'bg-emerald-500', change: '+5%' },
        { title: 'Low Stock Items', value: '23', icon: AlertTriangle, color: 'bg-orange-500', change: '-3%' },
        { title: "Today's Orders", value: '45', icon: ShoppingCart, color: 'bg-purple-500', change: '+8%' },
        { title: 'Monthly Sales', value: '$67,890', icon: TrendingUp, color: 'bg-green-500', change: '+15%' },
        { title: 'Total Revenue', value: '$456,789', icon: DollarSign, color: 'bg-blue-600', change: '+22%' },
        { title: 'Active Suppliers', value: '34', icon: Users, color: 'bg-indigo-500', change: '+2%' },
        { title: 'Pending Orders', value: '12', icon: FileText, color: 'bg-red-500', change: '-5%' },
      ];
    } else if (user?.role === 'procurement') {
      return [
        { title: 'Purchase Orders', value: '156', icon: ShoppingCart, color: 'bg-blue-500', change: '+10%' },
        { title: 'Active Suppliers', value: '34', icon: Users, color: 'bg-emerald-500', change: '+2%' },
        { title: 'Pending Approvals', value: '8', icon: AlertTriangle, color: 'bg-orange-500', change: '+3%' },
        { title: 'Monthly Purchases', value: '$48,000', icon: DollarSign, color: 'bg-purple-500', change: '+12%' },
      ];
    } else if (user?.role === 'sales') {
      return [
        { title: 'Daily Sales', value: '$5,678', icon: TrendingUp, color: 'bg-green-500', change: '+15%' },
        { title: "Today's Orders", value: '45', icon: ShoppingCart, color: 'bg-blue-500', change: '+8%' },
        { title: 'Active Pharmacies', value: '87', icon: Store, color: 'bg-emerald-500', change: '+5%' },
        { title: 'Pending Payments', value: '$12,340', icon: DollarSign, color: 'bg-orange-500', change: '-2%' },
      ];
    } else if (user?.role === 'inventory') {
      return [
        { title: 'Total Medicines', value: '1,234', icon: Package, color: 'bg-blue-500', change: '+12%' },
        { title: 'Low Stock Items', value: '23', icon: AlertTriangle, color: 'bg-red-500', change: '+5%' },
        { title: 'Expiring Soon', value: '15', icon: AlertTriangle, color: 'bg-orange-500', change: '+2%' },
        { title: 'Stock Value', value: '$234,567', icon: DollarSign, color: 'bg-emerald-500', change: '+8%' },
      ];
    } else {
      return [
        { title: 'My Orders', value: '28', icon: ShoppingCart, color: 'bg-blue-500', change: '+6%' },
        { title: 'Pending Orders', value: '3', icon: AlertTriangle, color: 'bg-orange-500', change: '0%' },
        { title: 'Total Spent', value: '$15,678', icon: DollarSign, color: 'bg-emerald-500', change: '+12%' },
        { title: 'Available Credit', value: '$8,500', icon: TrendingUp, color: 'bg-purple-500', change: '+5%' },
      ];
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your pharmacy system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      {(user?.role === 'admin' || user?.role === 'sales') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Sales & Purchases Trend</CardTitle>
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
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Medicine Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Medicines & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Medicines */}
        {(user?.role === 'admin' || user?.role === 'sales' || user?.role === 'inventory') && (
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topMedicines} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#2563EB" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        {(user?.role === 'admin' || user?.role === 'sales' || user?.role === 'pharmacy') && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.pharmacy}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">${order.amount.toLocaleString()}</p>
                      <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
