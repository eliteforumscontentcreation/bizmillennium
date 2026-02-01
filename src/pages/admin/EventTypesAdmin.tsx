import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
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

interface EventType {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function EventTypesAdmin() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<EventType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchEventTypes();
  }, []);

  async function fetchEventTypes() {
    const { data, error } = await supabase
      .from("event_types")
      .select("*")
      .order("sort_order");

    if (error) {
      toast.error("Failed to load event types");
    } else {
      setEventTypes(data || []);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      icon: "",
      sort_order: eventTypes.length,
      is_active: true,
    });
    setEditingType(null);
  }

  function handleEdit(eventType: EventType) {
    setEditingType(eventType);
    setFormData({
      name: eventType.name,
      description: eventType.description || "",
      icon: eventType.icon || "",
      sort_order: eventType.sort_order,
      is_active: eventType.is_active,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description || null,
      icon: formData.icon || null,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
    };

    if (editingType) {
      const { error } = await supabase
        .from("event_types")
        .update(payload)
        .eq("id", editingType.id);

      if (error) {
        toast.error("Failed to update event type");
      } else {
        toast.success("Event type updated");
        fetchEventTypes();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("event_types").insert(payload);

      if (error) {
        toast.error("Failed to create event type");
      } else {
        toast.success("Event type created");
        fetchEventTypes();
        setDialogOpen(false);
        resetForm();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event type?")) return;

    const { error } = await supabase.from("event_types").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete event type");
    } else {
      toast.success("Event type deleted");
      fetchEventTypes();
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from("event_types")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchEventTypes();
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Event Types</h2>
            <p className="text-muted-foreground">Manage event categories (Conferences, Roundtables, etc.)</p>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingType ? "Edit Event Type" : "Add Event Type"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Conference"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Lucide name)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="Calendar, Users, etc."
                    />
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
                  <Button type="submit">{editingType ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : eventTypes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4" />
                <p>No event types yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventTypes.map((eventType) => (
                    <TableRow key={eventType.id}>
                      <TableCell className="font-medium">{eventType.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {eventType.description || "-"}
                      </TableCell>
                      <TableCell>{eventType.sort_order}</TableCell>
                      <TableCell>
                        <Switch
                          checked={eventType.is_active}
                          onCheckedChange={() => toggleActive(eventType.id, eventType.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(eventType)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(eventType.id)}>
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
      </div>
    </AdminLayout>
  );
}
