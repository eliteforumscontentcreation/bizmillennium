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
import { Plus, Pencil, Trash2, Image, Upload, Loader2 } from "lucide-react";

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
  is_upcoming: boolean;
}

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
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
      .select("id, title, is_upcoming")
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
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

    let imageUrl = formData.image_url;

    // If a file is selected, upload it first
    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (!uploadedUrl) {
        return; // Upload failed, error already shown
      }
      imageUrl = uploadedUrl;
    }

    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please provide an image URL or upload an image",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...formData,
      image_url: imageUrl,
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
    setPreviewUrl(item.image_url);
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
    setSelectedFile(null);
    setPreviewUrl("");
    setIsDialogOpen(false);
  };

  const getEventTitle = (eventId: string | null) => {
    if (!eventId) return "No Event";
    const event = events.find(e => e.id === eventId);
    return event?.title || "Unknown Event";
  };

  const getEventStatus = (eventId: string | null) => {
    if (!eventId) return null;
    const event = events.find(e => e.id === eventId);
    return event?.is_upcoming ? "Upcoming" : "Past";
  };

  const filteredItems = selectedEventFilter === "all" 
    ? items 
    : selectedEventFilter === "upcoming"
    ? items.filter(item => {
        const event = events.find(e => e.id === item.event_id);
        return event?.is_upcoming === true;
      })
    : selectedEventFilter === "past"
    ? items.filter(item => {
        const event = events.find(e => e.id === item.event_id);
        return event?.is_upcoming === false;
      })
    : items.filter(item => item.event_id === selectedEventFilter);

  const upcomingEvents = events.filter(e => e.is_upcoming);
  const pastEvents = events.filter(e => !e.is_upcoming);
  const upcomingPhotosCount = items.filter(item => {
    const event = events.find(e => e.id === item.event_id);
    return event?.is_upcoming === true;
  }).length;
  const pastPhotosCount = items.filter(item => {
    const event = events.find(e => e.id === item.event_id);
    return event?.is_upcoming === false;
  }).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gallery Management</h2>
            <p className="text-muted-foreground">Add photos to both upcoming and past events</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                      <SelectValue placeholder="Choose an event (upcoming or past)" />
                    </SelectTrigger>
                    <SelectContent>
                      {upcomingEvents.length > 0 && (
                        <>
                          <SelectItem value="__upcoming_header__" disabled className="font-semibold text-accent">
                            Upcoming Events
                          </SelectItem>
                          {upcomingEvents.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {pastEvents.length > 0 && (
                        <>
                          <SelectItem value="__past_header__" disabled className="font-semibold text-muted-foreground">
                            Past Events
                          </SelectItem>
                          {pastEvents.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    You can add photos to both upcoming and past events
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="flex-1"
                      />
                      {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    {previewUrl && (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Upload an image directly (max 5MB) or provide a URL below
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Or Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="/images/photo1770018880.jpg or https://..."
                    disabled={!!selectedFile}
                  />
                  <p className="text-xs text-muted-foreground">
                    {selectedFile ? "Clear the file upload to use URL" : "Provide an image URL if not uploading"}
                  </p>
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
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      editingItem ? "Update" : "Create"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedEventFilter} onValueChange={setSelectedEventFilter}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Photos ({items.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events ({upcomingPhotosCount})</TabsTrigger>
            <TabsTrigger value="past">Past Events ({pastPhotosCount})</TabsTrigger>
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
                      <TableHead>Event Status</TableHead>
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
                        <TableCell>
                          {getEventStatus(item.event_id) && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                getEventStatus(item.event_id) === "Upcoming"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {getEventStatus(item.event_id)}
                            </span>
                          )}
                        </TableCell>
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