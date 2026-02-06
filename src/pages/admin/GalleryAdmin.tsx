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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Image, Loader2 } from "lucide-react";

interface SiteGalleryItem {
  id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  category: string | null;
  is_active: boolean;
  sort_order: number;
}

const GALLERY_CATEGORIES = [
  "General",
  "Office",
  "Team",
  "Achievements",
  "Branding",
  "Facilities",
  "Other",
];

export default function GalleryAdmin() {
  const [items, setItems] = useState<SiteGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteGalleryItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image_url: "",
    alt_text: "",
    caption: "",
    category: "General",
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    // Fetch gallery items that are NOT linked to events (site gallery)
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .is("event_id", null)
      .order("sort_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch site gallery items",
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
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `site-gallery/${fileName}`;

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
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      image_url: imageUrl,
      alt_text: formData.alt_text || null,
      caption: formData.caption || null,
      category: formData.category || "General",
      is_active: formData.is_active,
      sort_order: formData.sort_order,
      event_id: null, // Site gallery items have no event_id
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
        toast({
          title: "Success",
          description: "Gallery item updated successfully",
        });
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
        toast({
          title: "Success",
          description: "Gallery item created successfully",
        });
        fetchItems();
        resetForm();
      }
    }
  };

  const handleEdit = (item: SiteGalleryItem) => {
    setEditingItem(item);
    setFormData({
      image_url: item.image_url,
      alt_text: item.alt_text || "",
      caption: item.caption || "",
      category: item.category || "General",
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
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      fetchItems();
    }
  };

  const resetForm = () => {
    setFormData({
      image_url: "",
      alt_text: "",
      caption: "",
      category: "General",
      is_active: true,
      sort_order: 0,
    });
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setIsDialogOpen(false);
  };

  const filteredItems =
    categoryFilter === "all"
      ? items
      : items.filter((item) => item.category === categoryFilter);

  const uniqueCategories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Site Gallery</h2>
            <p className="text-muted-foreground">
              Manage general website photos (not tied to events)
            </p>
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
                  {editingItem ? "Edit Photo" : "Add Photo to Site Gallery"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      {uploading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
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
                    placeholder="/images/photo.jpg or https://..."
                    disabled={!!selectedFile}
                  />
                  <p className="text-xs text-muted-foreground">
                    {selectedFile
                      ? "Clear the file upload to use URL"
                      : "Provide an image URL if not uploading"}
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
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sort_order: parseInt(e.target.value) || 0,
                        })
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
                    ) : editingItem ? (
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

        {/* Category Filter */}
        <div className="flex items-center gap-4">
          <Label>Filter by Category:</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Categories ({items.length})
              </SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat || "uncategorized"}>
                  {cat} ({items.filter((i) => i.category === cat).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Image className="h-12 w-12 mb-4" />
                <p>No site gallery items found</p>
                <p className="text-sm mt-2">
                  Add photos to showcase on your website
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Caption</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sort Order</TableHead>
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
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {item.category || "Uncategorized"}
                        </span>
                      </TableCell>
                      <TableCell>{item.sort_order}</TableCell>
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
      </div>
    </AdminLayout>
  );
}
