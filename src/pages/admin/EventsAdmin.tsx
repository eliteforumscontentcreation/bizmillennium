import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  ExternalLink,
  Loader2,
  Image,
} from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  venue: string | null;
  is_upcoming: boolean;
  is_featured: boolean;
  featured_image: string | null;
  hero_image: string | null;
  registration_url: string | null;
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);
  const [selectedFeaturedFile, setSelectedFeaturedFile] = useState<File | null>(
    null,
  );
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string>("");
  const [featuredPreviewUrl, setFeaturedPreviewUrl] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    event_date: "",
    location: "",
    venue: "",
    is_upcoming: true,
    is_featured: false,
    featured_image: "",
    hero_image: "",
    registration_url: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hero" | "featured",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
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

      if (type === "hero") {
        setSelectedHeroFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setHeroPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedFeaturedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFeaturedPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const uploadImage = async (
    file: File,
    folder: string,
  ): Promise<string | null> => {
    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Error",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let heroImageUrl = formData.hero_image;
    let featuredImageUrl = formData.featured_image;

    // Upload hero image if selected
    if (selectedHeroFile) {
      const uploadedUrl = await uploadImage(selectedHeroFile, "event-hero");
      if (uploadedUrl) {
        heroImageUrl = uploadedUrl;
      }
    }

    // Upload featured image if selected
    if (selectedFeaturedFile) {
      const uploadedUrl = await uploadImage(
        selectedFeaturedFile,
        "event-featured",
      );
      if (uploadedUrl) {
        featuredImageUrl = uploadedUrl;
      }
    }

    const eventData = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description || null,
      event_date: formData.event_date || null,
      location: formData.location || null,
      venue: formData.venue || null,
      is_upcoming: formData.is_upcoming,
      is_featured: formData.is_featured,
      featured_image: featuredImageUrl || null,
      hero_image: heroImageUrl || null,
      registration_url: formData.registration_url || null,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", editingEvent.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Event updated successfully" });
        fetchEvents();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("events").insert([eventData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Event created successfully" });
        fetchEvents();
        resetForm();
      }
    }
    setUploading(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description || "",
      event_date: event.event_date ? event.event_date.split("T")[0] : "",
      location: event.location || "",
      venue: event.venue || "",
      is_upcoming: event.is_upcoming,
      is_featured: event.is_featured,
      featured_image: event.featured_image || "",
      hero_image: event.hero_image || "",
      registration_url: event.registration_url || "",
    });
    setHeroPreviewUrl(event.hero_image || "");
    setFeaturedPreviewUrl(event.featured_image || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Event deleted successfully" });
      fetchEvents();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      event_date: "",
      location: "",
      venue: "",
      is_upcoming: true,
      is_featured: false,
      featured_image: "",
      hero_image: "",
      registration_url: "",
    });
    setEditingEvent(null);
    setSelectedHeroFile(null);
    setSelectedFeaturedFile(null);
    setHeroPreviewUrl("");
    setFeaturedPreviewUrl("");
    setIsDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Events</h2>
            <p className="text-muted-foreground">
              Manage your events, hero images, and registration links
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? "Edit Event" : "Create Event"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="Auto-generated from title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) =>
                        setFormData({ ...formData, event_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                  />
                </div>

                {/* Hero Image Upload */}
                <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                  <Label className="text-base font-semibold">Hero Image</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    This image will be displayed as the main banner for the
                    event page
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "hero")}
                        disabled={uploading}
                        className="flex-1"
                      />
                      {uploading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                    {heroPreviewUrl && (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                        <img
                          src={heroPreviewUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="text-center text-xs text-muted-foreground">
                      OR
                    </div>
                    <Input
                      id="hero_image"
                      value={formData.hero_image}
                      onChange={(e) =>
                        setFormData({ ...formData, hero_image: e.target.value })
                      }
                      placeholder="Enter hero image URL"
                      disabled={!!selectedHeroFile}
                    />
                  </div>
                </div>

                {/* Featured Image Upload */}
                <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                  <Label className="text-base font-semibold">
                    Featured Image (Thumbnail)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    This image will be used as thumbnail in event listings
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "featured")}
                        disabled={uploading}
                        className="flex-1"
                      />
                      {uploading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                    {featuredPreviewUrl && (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                        <img
                          src={featuredPreviewUrl}
                          alt="Featured Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="text-center text-xs text-muted-foreground">
                      OR
                    </div>
                    <Input
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featured_image: e.target.value,
                        })
                      }
                      placeholder="Enter featured image URL"
                      disabled={!!selectedFeaturedFile}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_url">Registration URL</Label>
                  <Input
                    id="registration_url"
                    value={formData.registration_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/register"
                  />
                  <p className="text-xs text-muted-foreground">
                    External link where users can register for this event
                  </p>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_upcoming"
                      checked={formData.is_upcoming}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_upcoming: checked })
                      }
                    />
                    <Label htmlFor="is_upcoming">Upcoming</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_featured: checked })
                      }
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingEvent ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
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
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4" />
                <p>No events found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hero</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        {event.hero_image ? (
                          <img
                            src={event.hero_image}
                            alt={event.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>
                        {event.event_date
                          ? format(new Date(event.event_date), "MMM d, yyyy")
                          : "TBD"}
                      </TableCell>
                      <TableCell>{event.location || "-"}</TableCell>
                      <TableCell>
                        {event.registration_url ? (
                          <a
                            href={event.registration_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-accent hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Link
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            event.is_upcoming
                              ? "bg-accent/10 text-accent"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {event.is_upcoming ? "Upcoming" : "Past"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(event.id)}
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
      </div>
    </AdminLayout>
  );
}
