import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Navigation, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NavigationItem {
  id: string;
  name: string;
  link: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-cyan-500", label: "Cyan" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-gray-600", label: "Gray" },
];

export default function NavigationAdmin() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    parent_id: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("navigation")
      .select("*")
      .order("sort_order");

    if (error) {
      toast.error("Failed to load navigation items");
      console.error(error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      link: "",
      parent_id: "",
      sort_order: items.length,
      is_active: true,
    });
    setEditingItem(null);
  }

  function handleEdit(item: NavigationItem) {
    setEditingItem(item);
    setFormData({
      name: item.name,
      link: item.link,
      parent_id: item.parent_id || "",
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: formData.name,
      link: formData.link,
      parent_id: formData.parent_id || null,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("navigation")
        .update(payload)
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Failed to update navigation item");
        console.error(error);
      } else {
        toast.success("Navigation item updated");
        fetchItems();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("navigation").insert(payload);

      if (error) {
        toast.error("Failed to create navigation item");
        console.error(error);
      } else {
        toast.success("Navigation item created");
        fetchItems();
        setDialogOpen(false);
        resetForm();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;

    const { error } = await supabase.from("navigation").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete navigation item");
      console.error(error);
    } else {
      toast.success("Navigation item deleted");
      fetchItems();
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from("navigation")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchItems();
    }
  }

  // Group items by parent
  const parentItems = items.filter((item) => !item.parent_id);
  const childItems = items.filter((item) => item.parent_id);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Navigation Management</h2>
            <p className="text-muted-foreground">Manage header navigation and dropdown menus</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Company"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/about"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Item (optional)</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No parent (top-level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No parent (top-level)</SelectItem>
                      {parentItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Navigation Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground">No navigation items yet. Add your first item to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.link}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.parent_id
                          ? items.find((p) => p.id === item.parent_id)?.name || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>{item.sort_order}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={() => toggleActive(item.id, item.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Mega Menu Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The About dropdown has two columns: <strong>About BM</strong> and <strong>Our Businesses</strong>.
              The items above will be used in the dropdown menu. Create parent items for each column, 
              then add child items under each parent.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">About BM Column</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Company</li>
                  <li>• Our Brands</li>
                  <li>• Partners</li>
                  <li>• Event Gallery</li>
                  <li>• Blog</li>
                  <li>• Careers</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Our Businesses Column</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Conferences</li>
                  <li>• Roundtable</li>
                  <li>• In-house</li>
                  <li>• Data Generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
