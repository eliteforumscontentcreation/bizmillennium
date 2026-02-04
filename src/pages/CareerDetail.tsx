import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Briefcase, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface Career {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string | null;
  requirements: Json | null;
  responsibilities: Json | null;
}

const CareerDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    cover_letter: "",
  });

  useEffect(() => {
    async function fetchCareer() {
      if (!slug) return;

      const { data, error } = await supabase
        .from("careers")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        navigate("/careers", { replace: true });
        return;
      }

      setCareer(data);
      setLoading(false);
    }
    fetchCareer();
  }, [slug, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!career) return;

    setSubmitting(true);

    const { error } = await supabase.from("job_applications").insert({
      career_id: career.id,
      applicant_name: formData.applicant_name,
      applicant_email: formData.applicant_email,
      applicant_phone: formData.applicant_phone || null,
      cover_letter: formData.cover_letter || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Application Submitted!",
        description: "We'll be in touch soon. Thank you for your interest!",
      });
      setFormData({
        applicant_name: "",
        applicant_email: "",
        applicant_phone: "",
        cover_letter: "",
      });
    }

    setSubmitting(false);
  };

  const parseJsonArray = (json: Json | null): string[] => {
    if (!json) return [];
    if (Array.isArray(json)) return json.filter((item): item is string => typeof item === "string");
    return [];
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!career) {
    return null;
  }

  const requirements = parseJsonArray(career.requirements);
  const responsibilities = parseJsonArray(career.responsibilities);

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container-wide">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            {career.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {career.department && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {career.department}
              </span>
            )}
            {career.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {career.location}
              </span>
            )}
            {career.employment_type && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {career.employment_type}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Job Details */}
            <div className="lg:col-span-2 space-y-8">
              {career.description && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">About the Role</h2>
                  <p className="text-muted-foreground leading-relaxed">{career.description}</p>
                </div>
              )}

              {responsibilities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Responsibilities</h2>
                  <ul className="space-y-2">
                    {responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-accent mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {requirements.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Requirements</h2>
                  <ul className="space-y-2">
                    {requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-accent mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div>
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                <h2 className="text-xl font-semibold mb-6 text-foreground">Apply Now</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.applicant_name}
                      onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.applicant_email}
                      onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.applicant_phone}
                      onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_letter">Cover Letter</Label>
                    <Textarea
                      id="cover_letter"
                      value={formData.cover_letter}
                      onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                      placeholder="Tell us why you're a great fit..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CareerDetail;
