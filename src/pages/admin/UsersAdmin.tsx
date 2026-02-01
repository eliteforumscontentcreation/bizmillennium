import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Users, Shield, ShieldCheck, User } from "lucide-react";

interface UserWithRole {
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
  profile?: {
    full_name: string | null;
  };
}

type AppRole = "admin" | "moderator" | "user";

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    role: "user" as AppRole,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch all user roles with their profiles
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role, created_at")
      .order("created_at", { ascending: false });

    if (rolesError) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Fetch profiles for all users
    const userIds = rolesData?.map(r => r.user_id) || [];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    // Combine the data
    const usersWithProfiles = rolesData?.map(role => ({
      ...role,
      role: role.role as AppRole,
      profile: profilesData?.find(p => p.user_id === role.user_id),
    })) || [];

    setUsers(usersWithProfiles);
    setLoading(false);
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // First, we need to find the user by email using profiles or check if they exist
    // Since we can't query auth.users directly, we'll create an edge function for this
    // For now, let's use a workaround - add role by user_id if admin knows it
    
    toast({
      title: "Info",
      description: "To add a user role, you need the user's ID. Users must first sign up, then you can promote them.",
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleUpdateRole = async (userId: string, newRole: AppRole) => {
    // Don't allow changing own role
    if (userId === currentUser?.id) {
      toast({
        title: "Error",
        description: "You cannot change your own role",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "User role updated successfully" });
      fetchUsers();
    }
  };

  const handleDeleteRole = async (userId: string) => {
    // Don't allow deleting own role
    if (userId === currentUser?.id) {
      toast({
        title: "Error",
        description: "You cannot remove your own admin role",
        variant: "destructive",
      });
      setDeleteUserId(null);
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove user role",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "User role removed successfully" });
      fetchUsers();
    }
    setDeleteUserId(null);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      role: "user",
    });
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-red-500" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeClass = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "moderator":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Users & Roles</h2>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add User Role</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddRole} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@example.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The user must have an existing account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: AppRole) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Role
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Users className="h-12 w-12 mb-4" />
                <p>No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-accent">
                              {user.profile?.full_name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.profile?.full_name || "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              ID: {user.user_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: AppRole) => handleUpdateRole(user.user_id, value)}
                          disabled={user.user_id === currentUser?.id}
                        >
                          <SelectTrigger className="w-[130px]">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                User
                              </div>
                            </SelectItem>
                            <SelectItem value="moderator">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Moderator
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                Admin
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteUserId(user.user_id)}
                          disabled={user.user_id === currentUser?.id}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Role Permissions</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                <span><strong>Admin:</strong> Full access to all admin features and user management</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-yellow-500" />
                <span><strong>Moderator:</strong> Can manage content but not users (coming soon)</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span><strong>User:</strong> Can view public content only</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User Role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user's role and they will lose access to admin features.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteRole(deleteUserId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
