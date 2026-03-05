import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppointments, useCreateAppointment, useStaffList } from "@/hooks/use-api";
import type { AppointmentWithStaff } from "@/lib/types";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  scheduled: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "default",
};

export default function Appointments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const { data: appointments = [], isLoading, error, refetch } = useAppointments();
  const { data: staffList = [] } = useStaffList();
  const createMutation = useCreateAppointment();

  const filtered = appointments.filter((item) => {
    const a = item.appointment;
    const staffName = `${item.staff.first_name} ${item.staff.last_name}`.toLowerCase();
    const matchSearch =
      a.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      staffName.includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const now = new Date().toISOString();
    const payload = {
      patient_national_id: parseInt(form.get("patient_national_id") as string),
      patient_name: form.get("patient_name") as string,
      patient_address: form.get("patient_address") as string || "",
      patient_phone_number: form.get("patient_phone_number") as string,
      patient_email: form.get("patient_email") as string || undefined,
      appointment_date: new Date(form.get("appointment_date") as string).toISOString(),
      appointment_time: form.get("appointment_time") as string,
      department: form.get("department") as string,
      staff_id: form.get("staff_id") as string,
      notes: form.get("notes") as string || undefined,
      status: "scheduled",
      created_at: now,
      updated_at: now,
    };
    try {
      await createMutation.mutateAsync(payload);
      toast({ title: "Appointment scheduled successfully" });
      setSheetOpen(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const columns = [
    {
      header: "Patient",
      cell: (row: AppointmentWithStaff) => <span className="font-medium">{row.appointment.patient_name}</span>,
    },
    {
      header: "Doctor",
      cell: (row: AppointmentWithStaff) => `Dr. ${row.staff.first_name} ${row.staff.last_name}`,
    },
    {
      header: "Date",
      cell: (row: AppointmentWithStaff) => {
        try { return format(new Date(row.appointment.appointment_date), "MMM d, yyyy"); } catch { return "—"; }
      },
    },
    {
      header: "Time",
      cell: (row: AppointmentWithStaff) => row.appointment.appointment_time || "—",
    },
    {
      header: "Department",
      cell: (row: AppointmentWithStaff) => row.appointment.department,
    },
    {
      header: "Status",
      cell: (row: AppointmentWithStaff) => {
        const s = row.appointment.status?.toLowerCase() || "pending";
        return <Badge variant={statusColors[s] || "secondary"}>{row.appointment.status}</Badge>;
      },
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

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Appointment</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display">Schedule Appointment</SheetTitle>
            </SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Patient Name</Label>
                  <Input name="patient_name" required />
                </div>
                <div className="space-y-1.5">
                  <Label>National ID</Label>
                  <Input name="patient_national_id" type="number" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input name="patient_phone_number" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input name="patient_email" type="email" />
                </div>
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input name="appointment_date" type="date" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input name="appointment_time" type="time" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <select name="department" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                  <option value="">Select department</option>
                  <option value="General">General</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="ENT">ENT</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Assign Doctor</Label>
                <select name="staff_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                  <option value="">Select doctor</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      Dr. {s.first_name} {s.last_name} — {s.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Patient Address</Label>
                <Input name="patient_address" />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Input name="notes" placeholder="Optional notes" />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                Schedule Appointment
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <DataTable<AppointmentWithStaff>
        columns={columns}
        data={filtered}
        loading={isLoading}
        error={error ? "Failed to load appointments" : null}
        onRetry={() => refetch()}
        emptyMessage="No appointments found"
      />
    </div>
  );
}
