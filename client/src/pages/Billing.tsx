import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Search, DollarSign, Clock, AlertCircle, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Invoice {
  id: string | number;
  invoiceNo: string;
  patient: string;
  date: string;
  amount: number;
  status: string;
  items: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  Paid: "default",
  unpaid: "secondary",
  Pending: "secondary",
  Overdue: "destructive",
};

export default function Billing() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await api.get<Invoice[]>("/billing");
      setInvoices(data || []);
    } catch (error) {
      toast({ title: "Error fetching invoices", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      patient: form.get("patient") as string,
      amount: parseFloat(form.get("amount") as string),
      items: form.get("items") as string,
      status: "Pending",
      date: new Date().toISOString(),
    };
    
    try {
      await api.post("/billing", payload);
      toast({ title: "Invoice created successfully" });
      setSheetOpen(false);
      fetchInvoices();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoiceNo}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { color: #3b82f6; margin: 0; }
              .details { margin: 30px 0; display: flex; justify-content: space-between; }
              .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .table th { background: #f8fafc; text-align: left; }
              .table th, .table td { border: 1px solid #e2e8f0; padding: 12px; }
              .total { margin-top: 30px; text-align: right; font-size: 1.2em; font-weight: bold; }
              .footer { margin-top: 50px; text-align: center; font-size: 0.8em; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Triple Ts Mediclinic</h1>
              <p>Professional Medical Services</p>
            </div>
            <div class="details">
              <div>
                <p><strong>Invoice To:</strong></p>
                <p>${invoice.patient}</p>
              </div>
              <div style="text-align: right;">
                <p><strong>Invoice No:</strong> ${invoice.invoiceNo}</p>
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${invoice.status}</p>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${invoice.items}</td>
                  <td style="text-align: right;">KES ${invoice.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div class="total">Total Amount: KES ${invoice.amount.toLocaleString()}</div>
            <div class="footer">
              <p>Thank you for choosing Triple Ts Mediclinic.</p>
              <p>This is a computer-generated invoice.</p>
            </div>
            <script>window.onload = () => { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const filtered = invoices.filter((inv) =>
    inv.patient.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = invoices.filter((i) => i.status.toLowerCase() === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status.toLowerCase() === "unpaid" || i.status.toLowerCase() === "pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status.toLowerCase() === "overdue").reduce((s, i) => s + i.amount, 0);

  const columns = [
    { header: "Invoice #", accessorKey: "invoiceNo" as const, className: "font-medium font-mono text-xs" },
    { header: "Patient", accessorKey: "patient" as const, className: "font-medium" },
    { header: "Date", accessorKey: "date" as const, cell: (row: Invoice) => new Date(row.date).toLocaleDateString() },
    { header: "Items", accessorKey: "items" as const, className: "max-w-[200px] truncate text-sm" },
    { header: "Amount", cell: (row: Invoice) => `KES ${row.amount.toLocaleString()}` },
    {
      header: "Status",
      cell: (row: Invoice) => <Badge variant={statusColors[row.status] || "secondary"}>{row.status}</Badge>,
    },
    {
      header: "",
      cell: (row: Invoice) => (
        <Button variant="ghost" size="sm" onClick={() => handlePrint(row)}>
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
            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Patient Name</Label>
                  <Input name="patient" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Amount (KES)</Label>
                  <Input name="amount" type="number" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Items / Services</Label>
                <Input name="items" placeholder="Consultation, Lab Test, etc." required />
              </div>
              <Button type="submit" className="w-full">Create Invoice</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage={loading ? "Loading..." : "No invoices found"} />
    </div>
  );
}
