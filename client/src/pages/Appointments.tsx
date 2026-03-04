import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  department: string;
  status: string;
}

const mockAppointments: Appointment[] = [
  { id: 1, patient: "Jane Mwangi", doctor: "Dr. Ochieng", date: "2026-03-04", time: "09:00", department: "General", status: "Scheduled" },
  { id: 2, patient: "John Kamau", doctor: "Dr. Njeri", date: "2026-03-04", time: "10:30", department: "Cardiology", status: "Completed" },
  { id: 3, patient: "Grace Njeri", doctor: "Dr. Ochieng", date: "2026-03-04", time: "11:00", department: "General", status: "Scheduled" },
  { id: 4, patient: "Peter Ochieng", doctor: "Dr. Kipchoge", date: "2026-03-04", time: "14:00", department: "Orthopedics", status: "Cancelled" },
  { id: 5, patient: "Mary Wanjiku", doctor: "Dr. Njeri", date: "2026-03-05", time: "09:30", department: "Pediatrics", status: "Scheduled" },
];

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  Scheduled: "default",
  Completed: "secondary",
  Cancelled: "destructive",
};

export default function Appointments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filtered = mockAppointments.filter((a) => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const columns = [
    { header: "Patient", accessorKey: "patient" as const, className: "font-medium" },
    { header: "Doctor", accessorKey: "doctor" as const },
    { header: "Date", accessorKey: "date" as const },
    { header: "Time", accessorKey: "time" as const },
    { header: "Department", accessorKey: "department" as const },
    {
      header: "Status",
      cell: (row: Appointment) => (
        <Badge variant={statusColors[row.status] || "secondary"}>{row.status}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search appointments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Schedule Appointment</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast({ title: "Appointment scheduled (demo)" }); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Patient</Label><Input placeholder="Patient name" required /></div>
                <div className="space-y-1.5"><Label>Doctor</Label><Input placeholder="Doctor name" required /></div>
                <div className="space-y-1.5"><Label>Date</Label><Input type="date" required /></div>
                <div className="space-y-1.5"><Label>Time</Label><Input type="time" required /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select dept" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Schedule</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={filtered} emptyMessage="No appointments found" />
    </div>
  );
}
