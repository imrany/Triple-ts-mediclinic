import { StatCard } from "@/components/StatCard";
import { Users, CalendarCheck, UserCog, FlaskConical, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { usePatients, useAppointments, useStaffList } from "@/hooks/use-api";
import { format } from "date-fns";

const COLORS = ["hsl(142, 55%, 42%)", "hsl(211, 65%, 45%)", "hsl(0, 72%, 51%)"];

export default function Dashboard() {
  const { data: patients = [], isLoading: pLoading } = usePatients();
  const { data: appointments = [], isLoading: aLoading } = useAppointments();
  const { data: staff = [], isLoading: sLoading } = useStaffList();

  const loading = pLoading || aLoading || sLoading;

  // Compute stats
  const today = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = (appointments || []).filter((a) => {
    try {
      if (!a || !a.appointment) return false;
      return format(new Date(a.appointment.appointment_date), "yyyy-MM-dd") === today;
    } catch { return false; }
  });

  const activeStaff = (staff || []).filter((s) => s && s.status?.toLowerCase() === "active");

  // Compute appointment status distribution
  const statusCounts = { completed: 0, scheduled: 0, cancelled: 0 };
  (appointments || []).forEach((a) => {
    if (!a || !a.appointment) return;
    const s = a.appointment.status?.toLowerCase();
    if (s === "completed") statusCounts.completed++;
    else if (s === "cancelled") statusCounts.cancelled++;
    else statusCounts.scheduled++;
  });
  const total = Math.max((appointments || []).length, 1);
  const statusData = [
    { name: "Completed", value: Math.round((statusCounts.completed / total) * 100) },
    { name: "Scheduled", value: Math.round((statusCounts.scheduled / total) * 100) },
    { name: "Cancelled", value: Math.round((statusCounts.cancelled / total) * 100) },
  ];

  // Compute department distribution
  const deptMap: Record<string, number> = {};
  (appointments || []).forEach((a) => {
    if (!a || !a.appointment) return;
    const d = a.appointment.department || "Other";
    deptMap[d] = (deptMap[d] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([dept, count]) => ({ dept, count })).slice(0, 6);

  // Recent patients
  const recentPatients = (patients || []).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))
        ) : (
          <>
            <StatCard title="Total Patients" value={patients.length.toLocaleString()} icon={Users} trend="up" change={`${patients.length} registered`} />
            <StatCard title="Today's Appointments" value={todayAppointments.length.toString()} icon={CalendarCheck} trend="neutral" change={`${appointments.length} total`} />
            <StatCard title="Active Staff" value={activeStaff.length.toString()} icon={UserCog} trend="up" change={`${staff.length} total`} />
            <StatCard title="Total Appointments" value={appointments.length.toString()} icon={FlaskConical} trend="neutral" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Appointments by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(211, 65%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No data yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-base">Appointment Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardContent className="pt-0 flex gap-4 justify-center text-xs">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent patients */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPatients.length > 0 ? (
            <div className="space-y-3">
              {recentPatients.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-muted-foreground">{p.email} · {p.department}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">{p.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No patients yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
