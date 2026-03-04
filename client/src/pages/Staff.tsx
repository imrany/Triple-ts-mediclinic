import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
}

const mockStaff: StaffMember[] = [
  { id: 1, name: "Dr. James Ochieng", role: "Doctor", department: "General", email: "ochieng@clinic.com", phone: "0712345678", status: "Active" },
  { id: 2, name: "Dr. Alice Njeri", role: "Doctor", department: "Cardiology", email: "njeri@clinic.com", phone: "0723456789", status: "Active" },
  { id: 3, name: "Nurse Faith Wanjiku", role: "Nurse", department: "General", email: "wanjiku@clinic.com", phone: "0734567890", status: "Active" },
  { id: 4, name: "Dr. Ben Kipchoge", role: "Doctor", department: "Orthopedics", email: "kipchoge@clinic.com", phone: "0745678901", status: "On Leave" },
  { id: 5, name: "Pharm. Lucy Akinyi", role: "Pharmacist", department: "Pharmacy", email: "akinyi@clinic.com", phone: "0756789012", status: "Active" },
  { id: 6, name: "Lab Tech. Samuel Mwai", role: "Lab Tech", department: "Laboratory", email: "mwai@clinic.com", phone: "0767890123", status: "Active" },
];

export default function Staff() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();

  const filtered = mockStaff.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || s.role.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

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
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Staff</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Add Staff Member</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast({ title: "Staff added (demo)" }); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Full Name</Label><Input required /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" required /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input required /></div>
                <div className="space-y-1.5"><Label>Role</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="doctor">Doctor</SelectItem><SelectItem value="nurse">Nurse</SelectItem><SelectItem value="pharmacist">Pharmacist</SelectItem><SelectItem value="lab_tech">Lab Tech</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} className="animate-fade-in hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm truncate">{s.name}</h3>
                    <Badge variant={s.status === "Active" ? "default" : "secondary"} className="shrink-0 text-xs">{s.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.role} · {s.department}</p>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{s.email}</div>
                    <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{s.phone}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
