'use client'

import { useState, useEffect } from 'react'
import { Role, UserStatus } from '@prisma/client'
import { Edit, Trash2, Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface UserData {
  id: string
  fullName: string
  email: string
  role: Role
  status: UserStatus
  teamName: string | null
  lastLoginAt: Date | null
  createdAt: Date
}

interface UserFormData {
  fullName: string
  email: string
  role: Role
  status: UserStatus
  teamName: string
  password?: string
}

export default function UserList() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    role: 'USER',
    status: 'ACTIVE',
    teamName: '',
    password: ''
  })

  // Users fetch गर्नुहोस्
  const fetchUsers = async (searchQuery = '') => {
    try {
      setLoading(true)
      const url = searchQuery 
        ? `/api/users?q=${encodeURIComponent(searchQuery)}`
        : '/api/users'
      
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsers()
  }, [])

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(search)
  }

  // User delete गर्नुहोस्
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        setUsers(users.filter(user => user.id !== id))
        alert('User deleted successfully')
      } else {
        alert(result.error || 'Failed to delete user')
      }
    } catch (err) {
      alert('Network error occurred')
      console.error('Error deleting user:', err)
    }
  }

  // User edit modal खोल्नुहोस्
  const handleEditClick = (user: UserData) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      teamName: user.teamName || '',
      password: ''
    })
    setIsEditModalOpen(true)
  }

  // User update गर्नुहोस्
  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          role: formData.role,
          status: formData.status,
          teamName: formData.teamName || null,
          ...(formData.password && { password: formData.password })
        })
      })
      const result = await response.json()

      if (result.success) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData, teamName: formData.teamName || null } : u))
        setIsEditModalOpen(false)
        alert('User updated successfully')
      } else {
        alert(result.error || 'Failed to update user')
      }
    } catch (err) {
      alert('Network error occurred')
      console.error('Error updating user:', err)
    }
  }

  // नयाँ user बनाउनुहोस्
  const handleCreateUser = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      alert('Please fill all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          status: formData.status,
          teamName: formData.teamName || null
        })
      })
      const result = await response.json()

      if (result.success) {
        await fetchUsers()
        setIsCreateModalOpen(false)
        setFormData({
          fullName: '',
          email: '',
          role: 'USER',
          status: 'ACTIVE',
          teamName: '',
          password: ''
        })
        alert('User created successfully')
      } else {
        alert(result.error || 'Failed to create user')
      }
    } catch (err) {
      alert('Network error occurred')
      console.error('Error creating user:', err)
    }
  }

  // Create modal खोल्नुहोस्
  const handleCreateClick = () => {
    setFormData({
      fullName: '',
      email: '',
      role: 'USER',
      status: 'ACTIVE',
      teamName: '',
      password: ''
    })
    setIsCreateModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
        <button 
          onClick={() => fetchUsers()}
          className="mt-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Edit Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-white dark:bg-slate-900 border dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit User</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Full Name *</label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Email *</label>
                  <Input
                    value={formData.email}
                    disabled
                    className="bg-slate-100 dark:bg-slate-800"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full h-9 px-3 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="w-full h-9 px-3 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISABLED">DISABLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Team Name</label>
                  <Input
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">New Password (leave blank to keep current)</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-[#00C853] hover:bg-[#00C853]/90" onClick={handleUpdateUser}>
                    Update User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-white dark:bg-slate-900 border dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New User</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Full Name *</label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Password *</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full h-9 px-3 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="w-full h-9 px-3 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISABLED">DISABLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Team Name</label>
                  <Input
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="Enter team name"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-[#00C853] hover:bg-[#00C853]/90" onClick={handleCreateUser}>
                    Create User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Form */}
      <div className="flex justify-between items-center gap-3">
        <form onSubmit={handleSearch} className="flex gap-3 flex-1">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or team..."
            className="flex-1"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {search && (
            <Button
              type="button"
              onClick={() => {
                setSearch('')
                fetchUsers()
              }}
              variant="secondary"
            >
              Clear
            </Button>
          )}
        </form>
        <Button onClick={handleCreateClick} className="bg-[#00C853] hover:bg-[#00C853]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-slate-800 overflow-hidden border dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-slate-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'ACTIVE' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.teamName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 inline-flex items-center gap-1"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => window.location.href = `/admin/users/${user.id}`}
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.fullName)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-500 dark:text-slate-400">
        Total: {users.length} users
      </div>
    </div>
  )
}