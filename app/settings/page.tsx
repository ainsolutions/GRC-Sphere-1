"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { getOrganizations, deleteOrganization } from "@/lib/actions/organization-actions"
import { getDepartments, deleteDepartment } from "@/lib/actions/department-actions"
import { getUsers, deleteUser } from "@/lib/actions/user-actions"
import { UserForm } from "@/components/admin/user-form"
import { DepartmentForm } from "@/components/admin/department-form"
import { OrganizationForm } from "@/components/admin/organization-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  Briefcase,
  Trash2,
  Edit,
  Plus,
  Shield,
  Key,
  Database,
  BookTemplate as Template,
  Activity,
  Settings,
} from "lucide-react"
import { getRoles, deleteRole } from "@/lib/actions/role-actions"
import { RoleForm } from "@/components/admin/role-form"
import { RolePermissionsForm } from "@/components/admin/role-permissions-form"
import { TablePermissionsForm } from "@/components/admin/table-permissions-form"
import { PermissionsManagement } from "@/components/admin/permissions-management"
import { DatabaseTablesManagement } from "@/components/admin/database-tables-management"
import { VendorTypeTemplateManager } from "@/components/vendor-type-template-manager"
import { CustomAssessmentTemplateManager } from "@/components/custom-assessment-template-manager"
import { AuditLogsManagement } from "@/components/admin/audit-logs-management"
import { SystemConfiguration } from "@/components/admin/system-configuration"
import { PasswordGenerator } from "@/components/admin/password-generator"
import { ActionButtons } from "@/components/ui/action-buttons"

export default function SettingsPage() {
  const [users, setUsers] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [departments, setDepartments] = useState([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [showDepartmentForm, setShowDepartmentForm] = useState(false)
  const [showOrganizationForm, setShowOrganizationForm] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [editingOrganization, setEditingOrganization] = useState<any>(null)
  const [roles, setRoles] = useState([])
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [showRolePermissionsForm, setShowRolePermissionsForm] = useState(false)
  const [showTablePermissionsForm, setShowTablePermissionsForm] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<any>(null)

  const fetchData = async () => {
    try {
      const [orgsResult, deptsResult, usersResult, rolesResult] = await Promise.all([
        getOrganizations(),
        getDepartments(),
        getUsers(),
        getRoles(),
      ])

      if (orgsResult.success) setOrganizations(orgsResult.data)
      if (deptsResult.success) setDepartments(deptsResult.data)
      if (usersResult.success) setUsers(usersResult.data)
      if (rolesResult.success) setRoles(rolesResult.data)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteUser = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(userId)
      if (result.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteDepartment = async (departmentId: number) => {
    if (confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      const result = await deleteDepartment(departmentId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Department deleted successfully",
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteOrganization = async (organizationId: number) => {
    if (
      confirm("Are you sure you want to delete this organization? This will affect all related departments and users.")
    ) {
      const result = await deleteOrganization(organizationId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Organization deleted successfully",
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteRole = async (roleId: number) => {
    if (confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      const result = await deleteRole(roleId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen aurora-bg">
      <div className="aurora-overlay"></div>
      <div className="flex aurora-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold ">
            Admin Panel
          </h1>
          <p className="text-2xl ">
            Manage users, organizations, and departments
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Access
            </TabsTrigger>
            <TabsTrigger value="vendor-templates" className="flex items-center gap-2">
              <Template className="h-4 w-4" />
              Vendor Templates
            </TabsTrigger>
            <TabsTrigger value="assessment-templates" className="flex items-center gap-2">
              <Template className="h-4 w-4" />
              Assessment Templates
            </TabsTrigger>
            <TabsTrigger value="audit-logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="system-config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Config
            </TabsTrigger>
            <TabsTrigger value="password-management" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Passwords
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users and their access</CardDescription>
                  </div>
                  <ActionButtons isTableAction={false} onAdd={() => setShowUserForm(true)} btnAddText="Add User" />
                  {/* <Button onClick={() => setShowUserForm(true)} className="gradient-bg text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.organization_name}</TableCell>
                        <TableCell>{user.department_name || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "Active"
                                ? "default"
                                : user.status === "Inactive"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <ActionButtons isTableAction={true}
                              //onView={() => {}}
                              onEdit={() => {
                                setEditingUser(user)
                                setShowUserForm(true)
                              }}
                              onDelete={() => handleDeleteUser(user.id)}
                                actionObj={user}
                              //deleteDialogTitle={}
                            />
                            {/* <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUser(user)
                                setShowUserForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Department Management</CardTitle>
                    <CardDescription>Manage organizational departments and hierarchy</CardDescription>
                  </div>
                  <ActionButtons isTableAction={false} onAdd={() => setShowUserForm(true)} btnAddText="Add Department" />
                  {/* <Button onClick={() => setShowDepartmentForm(true)} className="gradient-bg text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Parent Department</TableHead>
                      <TableHead>Department Head</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department: any) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">{department.name}</TableCell>
                        <TableCell>{department.organization_name}</TableCell>
                        <TableCell>{department.parent_department_name || "None"}</TableCell>
                        <TableCell>{department.department_head || "Not assigned"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{department.user_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          {department.budget ? `$${Number(department.budget).toLocaleString()}` : "Not set"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              department.status === "Active"
                                ? "default"
                                : department.status === "Inactive"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {department.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <ActionButtons isTableAction={true}
                              //onView={() => {}}
                              onEdit={() => {
                                setEditingDepartment(department)
                                setShowDepartmentForm(true)
                              }}
                              onDelete={() => handleDeleteDepartment(department.id)}
                                actionObj={department}
                              //deleteDialogTitle={}
                            />
                            {/* <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDepartment(department)
                                setShowDepartmentForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteDepartment(department.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Organization Management</CardTitle>
                    <CardDescription>Manage organizations and their settings</CardDescription>
                  </div>
                  <ActionButtons isTableAction={false} onAdd={() => setShowOrganizationForm(true)} btnAddText="Add Organization" />
                  {/* <Button onClick={() => setShowOrganizationForm(true)} className="gradient-bg text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Departments</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((organization: any) => (
                      <TableRow key={organization.id}>
                        <TableCell className="font-medium">{organization.name}</TableCell>
                        <TableCell>{organization.organization_type}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{organization.contact_email}</div>
                            <div className="text-muted-foreground">{organization.contact_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{organization.department_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{organization.user_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              organization.status === "Active"
                                ? "default"
                                : organization.status === "Inactive"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {organization.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <ActionButtons isTableAction={true}
                              //onView={() => {}}
                              onEdit={() => {
                                setEditingOrganization(organization)
                                setShowOrganizationForm(true)
                              }}
                              onDelete={() => handleDeleteOrganization(organization.id)}
                                actionObj={organization}
                              //deleteDialogTitle={}
                            />
                            {/* <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingOrganization(organization)
                                setShowOrganizationForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteOrganization(organization.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Role Management</CardTitle>
                    <CardDescription>Manage system roles and their hierarchies</CardDescription>
                  </div>
                  <ActionButtons isTableAction={false} onAdd={() => setShowRoleForm(true)} btnAddText="Add Role" />
                  {/* <Button onClick={() => setShowRoleForm(true)} className="gradient-bg text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role: any) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description || "No description"}</TableCell>
                        <TableCell>
                          <Badge variant={role.is_system_role ? "default" : "secondary"}>
                            {role.is_system_role ? "System" : "Custom"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{role.user_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{role.permission_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <ActionButtons isTableAction={true}
                              //onView={() => {}}
                              onEdit={() => {
                                setEditingRole(role)
                                setShowRoleForm(true)
                              }}
                              onDelete={() => handleDeleteRole(role.id)}
                                actionObj={role}
                              //deleteDialogTitle={}
                            />
                            {/* <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRole(role)
                                setShowRoleForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRoleForPermissions(role)
                                setShowRolePermissionsForm(true)
                              }}
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRoleForPermissions(role)
                                setShowTablePermissionsForm(true)
                              }}
                            >
                              <Database className="h-4 w-4" />
                            </Button>
                            {!role.is_system_role && (
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteRole(role.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )} */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <PermissionsManagement />
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <DatabaseTablesManagement />
          </TabsContent>

          <TabsContent value="vendor-templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Type Templates</CardTitle>
                <CardDescription>Manage vendor assessment templates by type</CardDescription>
              </CardHeader>
              <CardContent>
                <VendorTypeTemplateManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment-templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Assessment Templates</CardTitle>
                <CardDescription>Create and manage custom assessment templates</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomAssessmentTemplateManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-logs" className="space-y-6">
            <AuditLogsManagement />
          </TabsContent>

          <TabsContent value="system-config" className="space-y-6">
            <SystemConfiguration />
          </TabsContent>

          <TabsContent value="password-management" className="space-y-6">
            <PasswordGenerator />
          </TabsContent>
        </Tabs>

        {/* User Form Modal */}
        {showUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <UserForm
                user={editingUser}
                onSuccess={() => {
                  setShowUserForm(false)
                  setEditingUser(null)
                  fetchData()
                }}
                onCancel={() => {
                  setShowUserForm(false)
                  setEditingUser(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Department Form Modal */}
        {showDepartmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <DepartmentForm
                department={editingDepartment}
                onSuccess={() => {
                  setShowDepartmentForm(false)
                  setEditingDepartment(null)
                  fetchData()
                }}
                onCancel={() => {
                  setShowDepartmentForm(false)
                  setEditingDepartment(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Organization Form Modal */}
        {showOrganizationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <OrganizationForm
                organization={editingOrganization}
                onSuccess={() => {
                  setShowOrganizationForm(false)
                  setEditingOrganization(null)
                  fetchData()
                }}
                onCancel={() => {
                  setShowOrganizationForm(false)
                  setEditingOrganization(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Role Form Modal */}
        {showRoleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <RoleForm
                role={editingRole}
                onSuccess={() => {
                  setShowRoleForm(false)
                  setEditingRole(null)
                  fetchData()
                }}
                onCancel={() => {
                  setShowRoleForm(false)
                  setEditingRole(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Role Permissions Form Modal */}
        {showRolePermissionsForm && selectedRoleForPermissions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <RolePermissionsForm
                roleId={selectedRoleForPermissions.id}
                roleName={selectedRoleForPermissions.name}
                onSuccess={() => {
                  setShowRolePermissionsForm(false)
                  setSelectedRoleForPermissions(null)
                  fetchData()
                }}
                onCancel={() => {
                  setShowRolePermissionsForm(false)
                  setSelectedRoleForPermissions(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Table Permissions Form Modal */}
        {showTablePermissionsForm && selectedRoleForPermissions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <TablePermissionsForm
                roleId={selectedRoleForPermissions.id}
                roleName={selectedRoleForPermissions.name}
                onSuccess={() => {
                  setShowTablePermissionsForm(false)
                  setSelectedRoleForPermissions(null)
                  fetchData()
                }}
                onCancel={() => {
                  setShowTablePermissionsForm(false)
                  setSelectedRoleForPermissions(null)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
