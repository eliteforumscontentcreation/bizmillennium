import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
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

interface HeroSection {
  id: string;
  headline: string;
  subheadline: string | null;
  cta_text: string | null;
  cta_link: string | null;
  secondary_cta_text: string | null;
  secondary_cta_link: string | null;
  background_image: string | null;
  page_id: string | null;
  sort_order: number;
  is_active: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

export default function HeroSectionsAdmin() {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);
  const [formData, setFormData] = useState({
    headline: "",
    subheadline: "",
    cta_text: "",
    cta_link: "",
    secondary_cta_text: "",
    secondary_cta_link: "",
    background_image: "",
    page_id: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [heroRes, pagesRes] = await Promise.all([
      supabase.from("hero_sections").select("*").order("sort_order"),
      supabase.from("pages").select("id, title, slug"),
    ]);

    if (heroRes.error) {
      toast.error("Failed to load hero sections");
    } else {
      setHeroSections(heroRes.data || []);
    }

    if (!pagesRes.error) {
      setPages(pagesRes.data || []);
    }

    setLoading(false);
  }

  function resetForm() {
    setFormData({
      headline: "",
      subheadline: "",
      cta_text: "",
      cta_link: "",
      secondary_cta_text: "",
      secondary_cta_link: "",
      background_image: "",
      page_id: "",
      sort_order: heroSections.length,
      is_active: true,
    });
    setEditingHero(null);
  }

  function handleEdit(hero: HeroSection) {
    setEditingHero(hero);
    setFormData({
      headline: hero.headline,
      subheadline: hero.subheadline || "",
      cta_text: hero.cta_text || "",
      cta_link: hero.cta_link || "",
      secondary_cta_text: hero.secondary_cta_text || "",
      secondary_cta_link: hero.secondary_cta_link || "",
      background_image: hero.background_image || "",
      page_id: hero.page_id || "",
      sort_order: hero.sort_order,
      is_active: hero.is_active,
    });
    setDialogOpen(true);
  }

  function getPageTitle(pageId: string | null) {
    if (!pageId) return "Homepage";
    const page = pages.find((p) => p.id === pageId);
    return page?.title || "Unknown";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      headline: formData.headline,
      subheadline: formData.subheadline || null,
      cta_text: formData.cta_text || null,
      cta_link: formData.cta_link || null,
      secondary_cta_text: formData.secondary_cta_text || null,
      secondary_cta_link: formData.secondary_cta_link || null,
      background_image: formData.background_image || null,
      page_id: formData.page_id || null,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
    };

    if (editingHero) {
      const { error } = await supabase
        .from("hero_sections")
        .update(payload)
        .eq("id", editingHero.id);

      if (error) {
        toast.error("Failed to update hero section");
      } else {
        toast.success("Hero section updated");
        fetchData();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("hero_sections").insert(payload);

      if (error) {
        toast.error("Failed to create hero section");
      } else {
        toast.success("Hero section created");
        fetchData();
        setDialogOpen(false);
        resetForm();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this hero section?")) return;

    const { error } = await supabase.from("hero_sections").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete hero section");
    } else {
      toast.success("Hero section deleted");
      fetchData();
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from("hero_sections")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchData();
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Hero Sections</h2>
            <p className="text-muted-foreground">Manage hero banners for pages</p>
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
                Add Hero Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingHero ? "Edit Hero Section" : "Add Hero Section"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="Main headline text"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subheadline">Subheadline</Label>
                  <Input
                    id="subheadline"
                    value={formData.subheadline}
                    onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                    placeholder="Supporting text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta_text">Primary CTA Text</Label>
                    <Input
                      id="cta_text"
                      value={formData.cta_text}
                      onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                      placeholder="Learn More"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_link">Primary CTA Link</Label>
                    <Input
                      id="cta_link"
                      value={formData.cta_link}
                      onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                      placeholder="/about"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondary_cta_text">Secondary CTA Text</Label>
                    <Input
                      id="secondary_cta_text"
                      value={formData.secondary_cta_text}
                      onChange={(e) => setFormData({ ...formData, secondary_cta_text: e.target.value })}
                      placeholder="Contact Us"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_cta_link">Secondary CTA Link</Label>
                    <Input
                      id="secondary_cta_link"
                      value={formData.secondary_cta_link}
                      onChange={(e) => setFormData({ ...formData, secondary_cta_link: e.target.value })}
                      placeholder="/contact"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_image">Background Image URL</Label>
                  <Input
                    id="background_image"
                    value={formData.background_image}
                    onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page_id">Page</Label>
                    <Select
                      value={formData.page_id}
                      onValueChange={(value) => setFormData({ ...formData, page_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Homepage (default)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Homepage</SelectItem>
                        {pages.map((page) => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.title}
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
                  <Button type="submit">{editingHero ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Hero Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : heroSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Image className="h-12 w-12 mb-4" />
                <p>No hero sections yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Headline</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heroSections.map((hero) => (
                    <TableRow key={hero.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {hero.headline}
                      </TableCell>
                      <TableCell>{getPageTitle(hero.page_id)}</TableCell>
                      <TableCell>{hero.sort_order}</TableCell>
                      <TableCell>
                        <Switch
                          checked={hero.is_active}
                          onCheckedChange={() => toggleActive(hero.id, hero.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(hero)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(hero.id)}>
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
