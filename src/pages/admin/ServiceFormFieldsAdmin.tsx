import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServiceFormField {
  id: string;
  service_type: string;
  field_name: string;
  field_label: string;
  field_type: string;
  placeholder: string | null;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  validation_rules: Record<string, string | number | boolean>;
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "url", label: "URL" },
  { value: "date", label: "Date" },
];

const serviceTypes = [
  { value: "conferences", label: "Conferences" },
  { value: "roundtable", label: "Roundtable" },
  { value: "in-house", label: "In-House" },
  { value: "data-generation", label: "Data Generation" },
];

const ServiceFormFieldsAdmin = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<ServiceFormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>("conferences");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<ServiceFormField | null>(null);
  const [formData, setFormData] = useState({
    field_name: "",
    field_label: "",
    field_type: "text",
    placeholder: "",
    is_required: false,
    is_active: true,
  });

  const fetchFields = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_form_fields")
      .select("*")
      .eq("service_type", selectedService)
      .order("sort_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch form fields",
        variant: "destructive",
      });
    } else {
      setFields(data || []);
    }
    setLoading(false);
  }, [selectedService, toast]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleSave = async () => {
    const fieldData = {
      service_type: selectedService,
      field_name: formData.field_name.toLowerCase().replace(/\s+/g, "_"),
      field_label: formData.field_label,
      field_type: formData.field_type,
      placeholder: formData.placeholder || null,
      is_required: formData.is_required,
      is_active: formData.is_active,
      sort_order: editingField ? editingField.sort_order : fields.length + 1,
    };

    let error;
    if (editingField) {
      const result = await supabase
        .from("service_form_fields")
        .update(fieldData)
        .eq("id", editingField.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("service_form_fields")
        .insert([fieldData]);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Field ${editingField ? "updated" : "created"} successfully`,
      });
      setIsDialogOpen(false);
      resetForm();
      fetchFields();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this field?")) return;

    const { error } = await supabase
      .from("service_form_fields")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete field",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
      fetchFields();
    }
  };

  const handleToggleActive = async (field: ServiceFormField) => {
    const { error } = await supabase
      .from("service_form_fields")
      .update({ is_active: !field.is_active })
      .eq("id", field.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update field status",
        variant: "destructive",
      });
    } else {
      fetchFields();
    }
  };

  const handleReorder = async (field: ServiceFormField, direction: "up" | "down") => {
    const currentIndex = fields.findIndex((f) => f.id === field.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= fields.length) return;

    const newFields = [...fields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];

    // Update sort_order for both fields
    const updates = newFields.map((f, index) => ({
      id: f.id,
      sort_order: index + 1,
    }));

    for (const update of updates) {
      await supabase
        .from("service_form_fields")
        .update({ sort_order: update.sort_order })
        .eq("id", update.id);
    }

    fetchFields();
  };

  const openEditDialog = (field: ServiceFormField) => {
    setEditingField(field);
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      placeholder: field.placeholder || "",
      is_required: field.is_required,
      is_active: field.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingField(null);
    setFormData({
      field_name: "",
      field_label: "",
      field_type: "text",
      placeholder: "",
      is_required: false,
      is_active: true,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Service Form Fields</h1>
            <p className="text-muted-foreground">
              Customize form fields for each service type
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>

        {/* Service Type Filter */}
        <div className="flex gap-4">
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fields Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Field Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No fields found. Add your first field!
                  </TableCell>
                </TableRow>
              ) : (
                fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(field, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(field, "down")}
                          disabled={index === fields.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {field.field_name}
                      </code>
                    </TableCell>
                    <TableCell>{field.field_label}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{field.field_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {field.is_required ? (
                        <Badge className="bg-red-500">Required</Badge>
                      ) : (
                        <Badge variant="secondary">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={field.is_active}
                        onCheckedChange={() => handleToggleActive(field)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(field)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(field.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingField ? "Edit Field" : "Add New Field"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field_label">Field Label *</Label>
              <Input
                id="field_label"
                value={formData.field_label}
                onChange={(e) =>
                  setFormData({ ...formData, field_label: e.target.value })
                }
                placeholder="e.g., Your Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_name">Field Name *</Label>
              <Input
                id="field_name"
                value={formData.field_name}
                onChange={(e) =>
                  setFormData({ ...formData, field_name: e.target.value })
                }
                placeholder="e.g., full_name (lowercase, no spaces)"
              />
              <p className="text-xs text-muted-foreground">
                Will be converted to lowercase with underscores
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_type">Field Type *</Label>
              <Select
                value={formData.field_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, field_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={formData.placeholder}
                onChange={(e) =>
                  setFormData({ ...formData, placeholder: e.target.value })
                }
                placeholder="e.g., Enter your name"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_required"
                checked={formData.is_required}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_required: checked })
                }
              />
              <Label htmlFor="is_required">Required Field</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingField ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ServiceFormFieldsAdmin;