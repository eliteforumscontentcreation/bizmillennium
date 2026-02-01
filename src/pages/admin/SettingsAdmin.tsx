import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, Globe, Mail, Share2, Image } from "lucide-react";

interface SiteSettings {
  id: string;
  site_title: string;
  site_tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  global_seo_title: string | null;
  global_seo_description: string | null;
  global_seo_image: string | null;
}

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      toast.error("Failed to load settings");
      console.error(error);
    } else if (data) {
      setSettings(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update(settings)
      .eq("id", settings.id);

    if (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } else {
      toast.success("Settings saved successfully");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No settings found. Please initialize site settings first.</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Site Settings</h2>
          <p className="text-muted-foreground">Configure global site settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general" className="gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-2">
                <Share2 className="h-4 w-4" />
                Social
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-2">
                <Globe className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_title">Site Title</Label>
                      <Input
                        id="site_title"
                        value={settings.site_title}
                        onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site_tagline">Site Tagline</Label>
                      <Input
                        id="site_tagline"
                        value={settings.site_tagline || ""}
                        onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logo_url">Logo URL</Label>
                      <Input
                        id="logo_url"
                        value={settings.logo_url || ""}
                        onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favicon_url">Favicon URL</Label>
                      <Input
                        id="favicon_url"
                        value={settings.favicon_url || ""}
                        onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={settings.contact_email || ""}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Phone</Label>
                      <Input
                        id="contact_phone"
                        value={settings.contact_phone || ""}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_address">Address</Label>
                    <Textarea
                      id="contact_address"
                      value={settings.contact_address || ""}
                      onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Social Media Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook_url">Facebook</Label>
                      <Input
                        id="facebook_url"
                        value={settings.facebook_url || ""}
                        onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter_url">Twitter/X</Label>
                      <Input
                        id="twitter_url"
                        value={settings.twitter_url || ""}
                        onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn</Label>
                      <Input
                        id="linkedin_url"
                        value={settings.linkedin_url || ""}
                        onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram_url">Instagram</Label>
                      <Input
                        id="instagram_url"
                        value={settings.instagram_url || ""}
                        onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube_url">YouTube</Label>
                    <Input
                      id="youtube_url"
                      value={settings.youtube_url || ""}
                      onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Global SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="global_seo_title">Default SEO Title</Label>
                    <Input
                      id="global_seo_title"
                      value={settings.global_seo_title || ""}
                      onChange={(e) => setSettings({ ...settings, global_seo_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global_seo_description">Default SEO Description</Label>
                    <Textarea
                      id="global_seo_description"
                      value={settings.global_seo_description || ""}
                      onChange={(e) => setSettings({ ...settings, global_seo_description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global_seo_image">Default SEO Image URL</Label>
                    <Input
                      id="global_seo_image"
                      value={settings.global_seo_image || ""}
                      onChange={(e) => setSettings({ ...settings, global_seo_image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
