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
import { Plus, Pencil, Trash2, FileText, Eye } from "lucide-react";
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
import type { Json } from "@/integrations/supabase/types";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: Json;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
}

export default function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    is_published: false,
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("title");

    if (error) {
      toast.error("Failed to load pages");
      console.error(error);
    } else {
      setPages(data || []);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      title: "",
      slug: "",
      content: "",
      is_published: false,
      seo_title: "",
      seo_description: "",
    });
    setEditingPage(null);
  }

  function handleEdit(page: Page) {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: typeof page.content === 'string' ? page.content : JSON.stringify(page.content, null, 2),
      is_published: page.is_published,
      seo_title: page.seo_title || "",
      seo_description: page.seo_description || "",
    });
    setDialogOpen(true);
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let contentJson: Json;
    try {
      contentJson = formData.content ? JSON.parse(formData.content) : {};
    } catch {
      contentJson = { text: formData.content };
    }

    const payload = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      content: contentJson,
      is_published: formData.is_published,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
    };

    if (editingPage) {
      const { error } = await supabase
        .from("pages")
        .update(payload)
        .eq("id", editingPage.id);

      if (error) {
        toast.error("Failed to update page");
        console.error(error);
      } else {
        toast.success("Page updated");
        fetchPages();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("pages").insert(payload);

      if (error) {
        toast.error("Failed to create page");
        console.error(error);
      } else {
        toast.success("Page created");
        fetchPages();
        setDialogOpen(false);
        resetForm();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this page?")) return;

    const { error } = await supabase.from("pages").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete page");
      console.error(error);
    } else {
      toast.success("Page deleted");
      fetchPages();
    }
  }

  async function togglePublished(id: string, currentState: boolean) {
    const { error } = await supabase
      .from("pages")
      .update({ is_published: !currentState })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchPages();
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Pages Management</h2>
            <p className="text-muted-foreground">Manage static pages and their content</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPage ? "Edit Page" : "Add Page"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Page Title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="page-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (JSON format)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder='{"headline": "Title", "description": "Content..."}'
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter content as JSON. Example: {"{"}"headline": "Page Title", "subheadline": "Subtitle", "description": "Page content..."{"}"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    placeholder="SEO Title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="SEO meta description"
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPage ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : pages.length === 0 ? (
              <p className="text-muted-foreground">No pages yet. Add your first page to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                      <TableCell>
                        <Switch
                          checked={page.is_published}
                          onCheckedChange={() => togglePublished(page.id, page.is_published)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(page)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(page.id)}>
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
            <CardTitle>About Section Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create pages with the following slugs to customize the About section pages:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <code className="font-mono">company</code>
                <p className="text-muted-foreground mt-1">About Us page</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="font-mono">conferences</code>
                <p className="text-muted-foreground mt-1">Conferences page</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="font-mono">roundtable</code>
                <p className="text-muted-foreground mt-1">Roundtable page</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="font-mono">in-house</code>
                <p className="text-muted-foreground mt-1">In-House page</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <code className="font-mono">data-generation</code>
                <p className="text-muted-foreground mt-1">Data Generation page</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
