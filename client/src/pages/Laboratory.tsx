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

interface LabTest {
  id: number;
  patient: string;
  test: string;
  orderedBy: string;
  date: string;
  status: string;
  result?: string;
}

const mockTests: LabTest[] = [
  { id: 1, patient: "Jane Mwangi", test: "Complete Blood Count", orderedBy: "Dr. Ochieng", date: "2026-03-04", status: "Pending" },
  { id: 2, patient: "John Kamau", test: "Blood Sugar Level", orderedBy: "Dr. Njeri", date: "2026-03-04", status: "Completed", result: "Normal (95 mg/dL)" },
  { id: 3, patient: "Grace Njeri", test: "Urinalysis", orderedBy: "Dr. Ochieng", date: "2026-03-03", status: "Completed", result: "Normal" },
  { id: 4, patient: "Peter Ochieng", test: "X-Ray (Left Knee)", orderedBy: "Dr. Kipchoge", date: "2026-03-04", status: "In Progress" },
  { id: 5, patient: "Mary Wanjiku", test: "Liver Function Test", orderedBy: "Dr. Njeri", date: "2026-03-05", status: "Pending" },
];

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  Pending: "secondary",
  "In Progress": "default",
  Completed: "default",
};

export default function Laboratory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const filtered = mockTests.filter((t) => {
    const matchSearch = t.patient.toLowerCase().includes(search.toLowerCase()) || t.test.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status.toLowerCase().replace(" ", "_") === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { header: "Patient", accessorKey: "patient" as const, className: "font-medium" },
    { header: "Test", accessorKey: "test" as const },
    { header: "Ordered By", accessorKey: "orderedBy" as const },
    { header: "Date", accessorKey: "date" as const },
    {
      header: "Status",
      cell: (row: LabTest) => <Badge variant={statusColors[row.status] || "secondary"}>{row.status}</Badge>,
    },
    {
      header: "Result",
      cell: (row: LabTest) => <span className="text-sm">{row.result || "—"}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tests..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Lab Test</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader><SheetTitle className="font-display">Order Lab Test</SheetTitle></SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={(e) => { e.preventDefault(); toast({ title: "Lab test ordered (demo)" }); setSheetOpen(false); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Patient</Label><Input required /></div>
                <div className="space-y-1.5"><Label>Test Name</Label><Input required /></div>
              </div>
              <div className="space-y-1.5"><Label>Ordered By</Label><Input required /></div>
              <Button type="submit" className="w-full">Order Test</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>
      <DataTable columns={columns} data={filtered} emptyMessage="No lab tests found" />
    </div>
  );
}
