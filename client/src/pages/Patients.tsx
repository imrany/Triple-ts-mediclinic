import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  status: string;
  lastVisit: string;
}

const mockPatients: Patient[] = [
  { id: 1, name: "Jane Mwangi", age: 34, gender: "Female", phone: "0712345678", status: "Active", lastVisit: "2026-03-01" },
  { id: 2, name: "John Kamau", age: 52, gender: "Male", phone: "0723456789", status: "Active", lastVisit: "2026-02-28" },
  { id: 3, name: "Mary Wanjiku", age: 28, gender: "Female", phone: "0734567890", status: "Inactive", lastVisit: "2026-01-15" },
  { id: 4, name: "Peter Ochieng", age: 45, gender: "Male", phone: "0745678901", status: "Active", lastVisit: "2026-03-02" },
  { id: 5, name: "Grace Njeri", age: 38, gender: "Female", phone: "0756789012", status: "Active", lastVisit: "2026-03-03" },
  { id: 6, name: "David Kipchoge", age: 61, gender: "Male", phone: "0767890123", status: "Inactive", lastVisit: "2025-12-20" },
];

export default function Patients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filtered = mockPatients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { header: "Name", accessorKey: "name" as const, className: "font-medium" },
    { header: "Age", accessorKey: "age" as const, className: "w-16" },
    { header: "Gender", accessorKey: "gender" as const },
    { header: "Phone", accessorKey: "phone" as const },
    {
      header: "Status",
      cell: (row: Patient) => (
        <Badge variant={row.status === "Active" ? "default" : "secondary"}>{row.status}</Badge>
      ),
    },
    { header: "Last Visit", accessorKey: "lastVisit" as const },
    {
      header: "",
      cell: (_row: Patient) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">View</Button>
          <Button variant="ghost" size="sm"><FileUp className="h-3.5 w-3.5" /></Button>
        </div>
      ),
      className: "w-28",
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

        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add New Patient</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast({ title: "Patient added (demo)" }); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input placeholder="Patient name" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Age</Label>
                  <Input type="number" placeholder="Age" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input placeholder="0712345678" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input placeholder="Patient address" />
              </div>
              <Button type="submit" className="w-full">Save Patient</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No patients found" />
    </div>
  );
}
