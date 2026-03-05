import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Search, DollarSign, Clock, AlertCircle, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: number;
  invoiceNo: string;
  patient: string;
  date: string;
  amount: number;
  status: string;
  items: string;
}

const mockInvoices: Invoice[] = [
  { id: 1, invoiceNo: "INV-001", patient: "Jane Mwangi", date: "2026-03-04", amount: 3500, status: "Paid", items: "Consultation, Blood Test" },
  { id: 2, invoiceNo: "INV-002", patient: "John Kamau", date: "2026-03-03", amount: 8200, status: "Pending", items: "X-Ray, Consultation, Medication" },
  { id: 3, invoiceNo: "INV-003", patient: "Grace Njeri", date: "2026-03-02", amount: 1500, status: "Paid", items: "Consultation" },
  { id: 4, invoiceNo: "INV-004", patient: "Peter Ochieng", date: "2026-02-28", amount: 12000, status: "Overdue", items: "Surgery, Medication, Room" },
  { id: 5, invoiceNo: "INV-005", patient: "Mary Wanjiku", date: "2026-03-01", amount: 4800, status: "Pending", items: "Lab Tests, Consultation" },
];

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  Paid: "default",
  Pending: "secondary",
  Overdue: "destructive",
};

export default function Billing() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const filtered = mockInvoices.filter((inv) =>
    inv.patient.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = mockInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = mockInvoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = mockInvoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  const columns = [
    { header: "Invoice #", accessorKey: "invoiceNo" as const, className: "font-medium font-mono text-xs" },
    { header: "Patient", accessorKey: "patient" as const, className: "font-medium" },
    { header: "Date", accessorKey: "date" as const },
    { header: "Items", accessorKey: "items" as const, className: "max-w-[200px] truncate text-sm" },
    { header: "Amount", cell: (row: Invoice) => `KES ${row.amount.toLocaleString()}` },
    {
      header: "Status",
      cell: (row: Invoice) => <Badge variant={statusColors[row.status]}>{row.status}</Badge>,
    },
    {
      header: "",
      cell: (_row: Invoice) => (
        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Print invoice (demo)" })}>
          <Printer className="h-3.5 w-3.5" />
        </Button>
      ),
      className: "w-12",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="up" change="+18% this month" />
        <StatCard title="Pending" value={`KES ${totalPending.toLocaleString()}`} icon={Clock} trend="neutral" />
        <StatCard title="Overdue" value={`KES ${totalOverdue.toLocaleString()}`} icon={AlertCircle} trend="down" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Invoice</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader><SheetTitle className="font-display">Create Invoice</SheetTitle></SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={(e) => { e.preventDefault(); toast({ title: "Invoice created (demo)" }); setSheetOpen(false); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Patient</Label><Input required /></div>
                <div className="space-y-1.5"><Label>Amount (KES)</Label><Input type="number" required /></div>
              </div>
              <div className="space-y-1.5"><Label>Items / Services</Label><Input placeholder="Consultation, Lab Test, etc." required /></div>
              <Button type="submit" className="w-full">Create Invoice</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No invoices found" />
    </div>
  );
}
