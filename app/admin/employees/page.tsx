'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// API import removed — not used in this file
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaSearch, FaUserPlus, FaTrash, FaEye, FaTimes, FaEnvelope, FaPhone, FaCalendarAlt, FaBriefcase, FaUserTie } from 'react-icons/fa';

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  salary: number;
  profileImage?: string;
}

export default function AdminEmployees() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    // Mock employee data (replace with actual API call)
    setEmployees([
      {
        _id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@jhasha.com',
        phone: '+91 98765 43210',
        position: 'Head Chef',
        department: 'Kitchen',
        joinDate: '2023-01-15',
        salary: 45000,
      },
      {
        _id: '2',
        name: 'Priya Sharma',
        email: 'priya@jhasha.com',
        phone: '+91 98765 43211',
        position: 'Manager',
        department: 'Operations',
        joinDate: '2023-03-20',
        salary: 50000,
      },
      {
        _id: '3',
        name: 'Amit Patel',
        email: 'amit@jhasha.com',
        phone: '+91 98765 43212',
        position: 'Delivery Lead',
        department: 'Logistics',
        joinDate: '2023-05-10',
        salary: 35000,
      },
    ]);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const createEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock creation (replace with actual API call)
      const newEmp: Employee = {
        _id: Date.now().toString(),
        ...newEmployee,
        salary: parseFloat(newEmployee.salary),
        joinDate: new Date().toISOString(),
      };
      setEmployees([...employees, newEmp]);
      setShowCreateModal(false);
      setNewEmployee({ name: '', email: '', phone: '', position: '', department: '', salary: '' });
      toast.success('✅ Employee added successfully');
    } catch (error: any) {
      toast.error('Failed to create employee');
    }
  };

  const deleteEmployee = async (empId: string, empName: string) => {
    if (!confirm(`Are you sure you want to remove ${empName}?`)) {
      return;
    }

    try {
      setEmployees(employees.filter(e => e._id !== empId));
      toast.success('🗑️ Employee removed successfully');
    } catch (error: any) {
      toast.error('Failed to delete employee');
    }
  };

  const viewEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowViewModal(true);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
                <FaUserTie className="text-primary" /> Employee Management
              </h1>
              <p className="text-gray-600">Manage restaurant staff and team members</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold px-6 py-3 rounded-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaUserPlus /> Add Employee
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
            <p className="text-blue-700 font-bold text-sm mb-1">Total Staff</p>
            <p className="text-3xl font-black text-blue-600">{employees.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
            <p className="text-green-700 font-bold text-sm mb-1">Kitchen Staff</p>
            <p className="text-3xl font-black text-green-600">{employees.filter(e => e.department === 'Kitchen').length}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600">
            <p className="text-purple-700 font-bold text-sm mb-1">Operations</p>
            <p className="text-3xl font-black text-purple-600">{employees.filter(e => e.department === 'Operations').length}</p>
          </div>
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-600">
            <p className="text-orange-700 font-bold text-sm mb-1">Logistics</p>
            <p className="text-3xl font-black text-orange-600">{employees.filter(e => e.department === 'Logistics').length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, position, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition text-lg shadow-sm"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card bg-gray-200 h-32 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-16 animate-slideInUp">
            <div className="text-7xl mb-4">👥</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No employees found</p>
            <p className="text-gray-600">Try adjusting your search or add a new employee</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            {filteredEmployees.map((emp, index) => (
              <div
                key={emp._id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="card bg-white hover:shadow-xl transition transform hover:-translate-y-1 animate-slideInUp"
              >
                {/* Employee Card Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-red-600/20 flex items-center justify-center border-2 border-primary/20">
                    {emp.profileImage ? (
                      <img src={emp.profileImage} alt={emp.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-2xl">👨‍🍳</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-gray-900">{emp.name}</h3>
                    <p className="text-sm text-primary font-semibold">{emp.position}</p>
                    <p className="text-xs text-gray-600">{emp.department}</p>
                  </div>
                </div>

                {/* Employee Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <p className="flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-primary" /> {emp.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <FaPhone className="text-primary" /> {emp.phone}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <FaCalendarAlt className="text-primary" />
                    Joined: {new Date(emp.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <FaBriefcase className="text-primary" />
                    Salary: Rs.{emp.salary.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t-2 border-gray-100">
                  <button
                    onClick={() => viewEmployee(emp)}
                    className="flex-1 bg-blue-100 text-blue-600 hover:bg-blue-200 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp._id, emp.name)}
                    className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
            <div className="bg-gradient-to-r from-primary to-red-600 p-6 text-white relative">
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <FaTimes size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                  <span className="text-4xl">👨‍🍳</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-1">{selectedEmployee.name}</h2>
                  <p className="text-white/90">{selectedEmployee.position}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Department</p>
                  <p className="text-gray-900 font-semibold">{selectedEmployee.department}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Position</p>
                  <p className="text-gray-900 font-semibold">{selectedEmployee.position}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Email</p>
                  <p className="text-gray-900 font-semibold break-all">{selectedEmployee.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Phone</p>
                  <p className="text-gray-900 font-semibold">{selectedEmployee.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Salary</p>
                  <p className="text-gray-900 font-black text-xl">Rs.{selectedEmployee.salary.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Join Date</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(selectedEmployee.joinDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
            <div className="bg-gradient-to-r from-primary to-red-600 p-6 text-white relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-black mb-1">👨‍🍳 Add New Employee</h2>
              <p className="text-white/80">Add a team member to your restaurant</p>
            </div>
            <form onSubmit={createEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="john@jhasha.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Position *</label>
                <input
                  type="text"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="Head Chef"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Department *</label>
                <select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                >
                  <option value="">Select Department</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Operations">Operations</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Management">Management</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Salary (Rs.) *</label>
                <input
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="45000"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
                >
                  ✅ Add Employee
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-primary hover:text-primary transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
