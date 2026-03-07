import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Search, Trash2, CreditCard as Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { Patient } from "@/lib/types";
import { format } from "date-fns";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { toast } = useToast();
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/patients", data),
  });
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.patch(`/patients/${data.id}`, data),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/patients/${id}`),
    onSuccess: () => fetchPatients(),
    onError: (err: any) =>
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      }),
    retry: 2,
    retryDelay: 1000,
  });

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Patient[]>("/patients");
      setPatients(data || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const result = patients.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const matchSearch = fullName.includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
    setFiltered(result);
  }, [patients, search, statusFilter]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      first_name: form.get("first_name") as string,
      last_name: form.get("last_name") as string,
      phone_number: form.get("phone_number") as string,
      date_of_birth: new Date(
        form.get("date_of_birth") as string,
      ).toISOString(),
      national_id: parseInt(form.get("national_id") as string),
      address: form.get("address") as string,
      gender: form.get("gender") as string,
      status: (form.get("status") as string) || "active",
      department: (form.get("department") as string) || "General",
      email: form.get("email") as string,
    };
    try {
      if (editPatient) {
        await api.patch(`/patients/${editPatient.id}`, payload);
        toast({ title: "Patient updated successfully" });
      } else {
        await api.post("/patients", { ...payload, id: `pat-${Date.now()}` });
        toast({ title: "Patient added successfully" });
      }
      setSheetOpen(false);
      setEditPatient(null);
      fetchPatients();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/patients/${id}`);
      toast({ title: "Patient deleted" });
      fetchPatients();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  const openEdit = (p: Patient) => {
    setEditPatient(p);
    setSheetOpen(true);
  };

  const openCreate = () => {
    setEditPatient(null);
    setSheetOpen(true);
  };

  const columns = [
    {
      header: "Name",
      cell: (row: Patient) => (
        <span className="font-medium">
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    { header: "Gender", accessorKey: "gender" as const },
    { header: "Phone", accessorKey: "phone_number" as const },
    {
      header: "Email",
      accessorKey: "email" as const,
      className: "max-w-[180px] truncate text-sm",
    },
    { header: "Department", accessorKey: "department" as const },
    {
      header: "Status",
      cell: (row: Patient) => (
        <Badge
          variant={
            row.status?.toLowerCase() === "active" ? "default" : "secondary"
          }
        >
          {row.status || "N/A"}
        </Badge>
      ),
    },
    {
      header: "Created",
      cell: (row: Patient) => {
        try {
          return format(new Date(row.created_at), "MMM d, yyyy");
        } catch {
          return "—";
        }
      },
    },
    {
      header: "",
      cell: (row: Patient) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Sheet
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) setEditPatient(null);
          }}
        >
          <SheetTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" /> Add Patient
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display">
                {editPatient ? "Edit Patient" : "Add New Patient"}
              </SheetTitle>
            </SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input
                    name="first_name"
                    defaultValue={editPatient?.first_name || ""}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input
                    name="last_name"
                    defaultValue={editPatient?.last_name || ""}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={editPatient?.email || ""}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    name="phone_number"
                    defaultValue={editPatient?.phone_number || ""}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>National ID</Label>
                  <Input
                    name="national_id"
                    type="number"
                    defaultValue={editPatient?.national_id || ""}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input
                    name="date_of_birth"
                    type="date"
                    defaultValue={
                      editPatient?.date_of_birth
                        ? format(
                            new Date(editPatient.date_of_birth),
                            "yyyy-MM-dd",
                          )
                        : ""
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <select
                    name="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={editPatient?.gender || ""}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select
                    name="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={editPatient?.status || "active"}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <Input
                    name="department"
                    defaultValue={editPatient?.department || "General"}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input
                  name="address"
                  defaultValue={editPatient?.address || ""}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editPatient ? "Update Patient" : "Save Patient"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        error={error ? "Failed to load patients" : null}
        onRetry={() => fetchPatients()}
        emptyMessage="No patients found"
      />
    </div>
  );
}
