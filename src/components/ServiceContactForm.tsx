import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ServiceContactFormProps {
  serviceType: 'conferences' | 'roundtable' | 'in-house' | 'data-generation';
  title?: string;
  description?: string;
}

interface FormField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  placeholder: string | null;
  is_required: boolean;
  sort_order: number;
}

export function ServiceContactForm({ serviceType, title, description }: ServiceContactFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    fetchFormFields();
  }, [serviceType]);

  const fetchFormFields = async () => {
    setLoadingFields(true);
    const { data, error } = await supabase
      .from("service_form_fields")
      .select("*")
      .eq("service_type", serviceType)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching form fields:", error);
      toast({
        title: "Error",
        description: "Failed to load form fields",
        variant: "destructive",
      });
    } else {
      setFormFields(data || []);
      // Initialize form data with empty values
      const initialData: Record<string, string> = {};
      data?.forEach((field) => {
        initialData[field.field_name] = "";
      });
      setFormData(initialData);
    }
    setLoadingFields(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const missingFields = formFields
      .filter((field) => field.is_required && !formData[field.field_name]?.trim())
      .map((field) => field.field_label);

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Prepare submission data
    const submissionData = {
      service_type: serviceType,
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || null,
      company: formData.company || null,
      subject: formData.subject || null,
      message: formData.message || "",
      form_data: formData,
    };

    const { error } = await supabase
      .from("service_contact_submissions")
      .insert([submissionData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message Sent!",
        description: "Thank you for your interest. We'll get back to you soon.",
      });
      // Reset form
      const resetData: Record<string, string> = {};
      formFields.forEach((field) => {
        resetData[field.field_name] = "";
      });
      setFormData(resetData);
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      name: field.field_name,
      placeholder: field.placeholder || field.field_label,
      value: formData[field.field_name] || "",
      onChange: handleChange,
      required: field.is_required,
      className: "bg-background text-foreground",
    };

    if (field.field_type === "textarea") {
      return (
        <Textarea
          key={field.id}
          {...commonProps}
          rows={5}
        />
      );
    }

    return (
      <Input
        key={field.id}
        type={field.field_type}
        {...commonProps}
      />
    );
  };

  if (loadingFields) {
    return (
      <section id="contact-form" className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <p>Loading form...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="py-16 bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {title || "Contact Us"}
            </h2>
            <p className="text-lg text-primary-foreground/80">
              {description || "Fill out the form below and we'll get back to you soon."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map((field) => {
                // Check if field should be in a grid (text, email, tel, number, url, date)
                const isInlineField = ['text', 'email', 'tel', 'number', 'url', 'date'].includes(field.field_type);
                
                if (isInlineField) {
                  // Group inline fields in pairs
                  return null; // Will be handled below
                }
                
                return (
                  <div key={field.id}>
                    {renderField(field)}
                  </div>
                );
              })}
              
              {/* Render inline fields in grid */}
              {(() => {
                const inlineFields = formFields.filter((field) =>
                  ['text', 'email', 'tel', 'number', 'url', 'date'].includes(field.field_type)
                );
                
                const rows: FormField[][] = [];
                for (let i = 0; i < inlineFields.length; i += 2) {
                  rows.push(inlineFields.slice(i, i + 2));
                }
                
                return rows.map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {row.map((field) => (
                      <div key={field.id}>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                ));
              })()}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}