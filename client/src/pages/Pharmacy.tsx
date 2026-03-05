import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  expiry: string;
}

const mockMedications: Medication[] = [
  { id: 1, name: "Paracetamol 500mg", category: "Analgesic", stock: 500, unit: "tablets", price: 5, expiry: "2027-06-15" },
  { id: 2, name: "Amoxicillin 250mg", category: "Antibiotic", stock: 12, unit: "capsules", price: 15, expiry: "2026-12-01" },
  { id: 3, name: "Metformin 500mg", category: "Antidiabetic", stock: 200, unit: "tablets", price: 8, expiry: "2027-03-20" },
  { id: 4, name: "Ibuprofen 400mg", category: "NSAID", stock: 8, unit: "tablets", price: 10, expiry: "2026-09-10" },
  { id: 5, name: "Omeprazole 20mg", category: "Antacid", stock: 150, unit: "capsules", price: 12, expiry: "2027-01-05" },
  { id: 6, name: "Diazepam 5mg", category: "Sedative", stock: 3, unit: "tablets", price: 25, expiry: "2026-08-15" },
];

export default function Pharmacy() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const filtered = mockMedications.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Medication", accessorKey: "name" as const, className: "font-medium" },
    { header: "Category", accessorKey: "category" as const },
    {
      header: "Stock",
      cell: (row: Medication) => (
        <div className="flex items-center gap-2">
          <span>{row.stock} {row.unit}</span>
          {row.stock < 15 && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
        </div>
      ),
    },
    { header: "Price (KES)", cell: (row: Medication) => `${row.price.toFixed(2)}` },
    { header: "Expiry", accessorKey: "expiry" as const },
    {
      header: "Status",
      cell: (row: Medication) => (
        <Badge variant={row.stock < 10 ? "destructive" : row.stock < 20 ? "secondary" : "default"}>
          {row.stock < 10 ? "Critical" : row.stock < 20 ? "Low" : "In Stock"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search medications..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Medication</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader><SheetTitle className="font-display">Add Medication</SheetTitle></SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={(e) => { e.preventDefault(); toast({ title: "Medication added (demo)" }); setSheetOpen(false); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Name</Label><Input required /></div>
                <div className="space-y-1.5"><Label>Category</Label><Input required /></div>
                <div className="space-y-1.5"><Label>Stock</Label><Input type="number" required /></div>
                <div className="space-y-1.5"><Label>Unit</Label><Input placeholder="tablets" required /></div>
                <div className="space-y-1.5"><Label>Price (KES)</Label><Input type="number" step="0.01" required /></div>
                <div className="space-y-1.5"><Label>Expiry</Label><Input type="date" required /></div>
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>
      <DataTable columns={columns} data={filtered} emptyMessage="No medications found" />
    </div>
  );
}
