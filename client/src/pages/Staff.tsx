import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Mail, Phone, Trash2, Edit, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStaffList, useCreateStaff, useDeleteStaff, useUpdateStaff } from "@/hooks/use-api";
import type { Staff as StaffType } from "@/lib/types";

export default function Staff() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffType | null>(null);
  const { toast } = useToast();

  const { data: staffList = [], isLoading, error, refetch } = useStaffList();
  const createMutation = useCreateStaff();
  const deleteMutation = useDeleteStaff();
  const updateMutation = useUpdateStaff();

  const filtered = staffList.filter((s) => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || s.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const now = new Date().toISOString();
    const payload = {
      first_name: form.get("first_name") as string,
      last_name: form.get("last_name") as string,
      phone_number: form.get("phone_number") as string,
      date_of_birth: new Date(form.get("date_of_birth") as string).toISOString(),
      national_id: parseInt(form.get("national_id") as string),
      address: form.get("address") as string || "",
      department: form.get("department") as string,
      specialty: form.get("specialty") as string,
      start_date: new Date(form.get("start_date") as string).toISOString(),
      status: form.get("status") as string || "active",
      role: form.get("role") as string,
      email: form.get("email") as string,
      password: form.get("password") as string || "",
      experience: form.get("experience") as string || "",
      created_at: now,
      updated_at: now,
    };
    try {
      if (editStaff) {
        await updateMutation.mutateAsync({ id: editStaff.id, data: { ...payload, updated_at: now } });
        toast({ title: "Staff updated successfully" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Staff added successfully" });
      }
      setSheetOpen(false);
      setEditStaff(null);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Staff member deleted" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const openEdit = (s: StaffType) => {
    setEditStaff(s);
    setSheetOpen(true);
  };

  const openCreate = () => {
    setEditStaff(null);
    setSheetOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <p className="text-sm text-muted-foreground mb-3">Failed to load staff</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="nurse">Nurse</SelectItem>
              <SelectItem value="pharmacist">Pharmacist</SelectItem>
              <SelectItem value="lab tech">Lab Tech</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Sheet open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if (!open) setEditStaff(null); }}>
          <SheetTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Staff</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display">{editStaff ? "Edit Staff" : "Add Staff Member"}</SheetTitle>
            </SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input name="first_name" defaultValue={editStaff?.first_name || ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input name="last_name" defaultValue={editStaff?.last_name || ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input name="email" type="email" defaultValue={editStaff?.email || ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input name="phone_number" defaultValue={editStaff?.phone_number || ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label>National ID</Label>
                  <Input name="national_id" type="number" defaultValue={editStaff?.national_id || ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input name="date_of_birth" type="date" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <select name="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={editStaff?.role || ""} required>
                    <option value="">Select</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="lab tech">Lab Tech</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <Input name="department" defaultValue={editStaff?.department || ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Specialty</Label>
                  <Input name="specialty" defaultValue={editStaff?.specialty || ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Experience</Label>
                  <Input name="experience" defaultValue={editStaff?.experience || ""} />
                </div>
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input name="start_date" type="date" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={editStaff?.status || "active"}>
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input name="address" defaultValue={editStaff?.address || ""} />
              </div>
              {!editStaff && (
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input name="password" type="password" required />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {editStaff ? "Update Staff" : "Save Staff"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.id} className="animate-fade-in hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {s.first_name[0]}{s.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm truncate">{s.first_name} {s.last_name}</h3>
                      <Badge variant={s.status?.toLowerCase() === "active" ? "default" : "secondary"} className="shrink-0 text-xs">
                        {s.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.role} · {s.department}</p>
                    {s.specialty && <p className="text-xs text-muted-foreground">{s.specialty}</p>}
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{s.email}</div>
                      <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{s.phone_number}</div>
                    </div>
                    <div className="mt-3 flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} disabled={deleteMutation.isPending}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">No staff found</div>
          )}
        </div>
      )}
    </div>
  );
}
