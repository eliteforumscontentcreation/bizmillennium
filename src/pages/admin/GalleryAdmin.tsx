import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Image, Upload } from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  category: string | null;
  event_id: string | null;
  is_active: boolean;
  sort_order: number;
}

interface Event {
  id: string;
  title: string;
}

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image_url: "",
    alt_text: "",
    caption: "",
    category: "",
    event_id: "",
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchItems();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, title")
      .order("event_date", { ascending: false });
    
    if (data) {
      setEvents(data);
    }
  };

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.event_id) {
      toast({
        title: "Error",
        description: "Please select an event for this photo",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...formData,
      event_id: formData.event_id || null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("gallery")
        .update(submitData)
        .eq("id", editingItem.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update gallery item",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Gallery item updated successfully" });
        fetchItems();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("gallery").insert([submitData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create gallery item",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Gallery item created successfully" });
        fetchItems();
        resetForm();
      }
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      image_url: item.image_url,
      alt_text: item.alt_text || "",
      caption: item.caption || "",
      category: item.category || "",
      event_id: item.event_id || "",
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Gallery item deleted successfully" });
      fetchItems();
    }
  };

  const resetForm = () => {
    setFormData({
      image_url: "",
      alt_text: "",
      caption: "",
      category: "",
      event_id: "",
      is_active: true,
      sort_order: 0,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const getEventTitle = (eventId: string | null) => {
    if (!eventId) return "No Event";
    const event = events.find(e => e.id === eventId);
    return event?.title || "Unknown Event";
  };

  const filteredItems = selectedEventFilter === "all" 
    ? items 
    : items.filter(item => item.event_id === selectedEventFilter);

  const itemsByEvent = events.map(event => ({
    event,
    items: items.filter(item => item.event_id === event.id)
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gallery Management</h2>
            <p className="text-muted-foreground">Create events and add photos to build your event gallery</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Photo" : "Add Photo to Event"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event_id">Select Event *</Label>
                  <Select
                    value={formData.event_id || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, event_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    First create an event in Events admin, then add photos here
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL *</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="/images/photo1770018880.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Input
                    id="caption"
                    value={formData.caption}
                    onChange={(e) =>
                      setFormData({ ...formData, caption: e.target.value })
                    }
                    placeholder="Photo description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt_text">Alt Text</Label>
                  <Input
                    id="alt_text"
                    value={formData.alt_text}
                    onChange={(e) =>
                      setFormData({ ...formData, alt_text: e.target.value })
                    }
                    placeholder="Accessibility description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="e.g., Networking"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) =>
                        setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
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

        <Tabs value={selectedEventFilter} onValueChange={setSelectedEventFilter}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Photos ({items.length})</TabsTrigger>
            {events.slice(0, 5).map(event => {
              const count = items.filter(item => item.event_id === event.id).length;
              return (
                <TabsTrigger key={event.id} value={event.id}>
                  {event.title} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Image className="h-12 w-12 mb-4" />
                  <p>No gallery items found</p>
                  <p className="text-sm mt-2">Create an event first, then add photos to it</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Caption</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={item.image_url}
                            alt={item.alt_text || "Gallery image"}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>{item.caption || "-"}</TableCell>
                        <TableCell className="font-medium">{getEventTitle(item.event_id)}</TableCell>
                        <TableCell>{item.category || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
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
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
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
        </Tabs>
      </div>
    </AdminLayout>
  );
}