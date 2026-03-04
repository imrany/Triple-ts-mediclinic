import { StatCard } from "@/components/StatCard";
import { Users, CalendarCheck, UserCog, FlaskConical, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const visitData = [
  { month: "Jan", patients: 120 }, { month: "Feb", patients: 150 },
  { month: "Mar", patients: 180 }, { month: "Apr", patients: 160 },
  { month: "May", patients: 200 }, { month: "Jun", patients: 230 },
  { month: "Jul", patients: 210 }, { month: "Aug", patients: 250 },
];

const deptData = [
  { dept: "General", count: 45 }, { dept: "Pediatrics", count: 28 },
  { dept: "Cardiology", count: 18 }, { dept: "Orthopedics", count: 15 },
  { dept: "ENT", count: 12 },
];

const statusData = [
  { name: "Completed", value: 65 },
  { name: "Scheduled", value: 25 },
  { name: "Cancelled", value: 10 },
];
const COLORS = ["hsl(142, 55%, 42%)", "hsl(211, 65%, 45%)", "hsl(0, 72%, 51%)"];

const recentActivity = [
  { id: 1, action: "New patient registered", name: "Jane Mwangi", time: "5 min ago" },
  { id: 2, action: "Appointment completed", name: "Dr. Ochieng", time: "12 min ago" },
  { id: 3, action: "Lab results ready", name: "Patient #1042", time: "30 min ago" },
  { id: 4, action: "Prescription filled", name: "John Kamau", time: "1 hr ago" },
  { id: 5, action: "Staff checked in", name: "Nurse Wanjiku", time: "2 hr ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Patients" value="1,248" change="+12% from last month" icon={Users} trend="up" />
        <StatCard title="Today's Appointments" value="32" change="8 pending" icon={CalendarCheck} trend="neutral" />
        <StatCard title="Active Staff" value="48" change="+2 this week" icon={UserCog} trend="up" />
        <StatCard title="Pending Lab Tests" value="15" change="3 urgent" icon={FlaskConical} trend="down" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Patient Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(211, 65%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(211, 65%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="patients" stroke="hsl(211, 65%, 45%)" fill="url(#visitGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
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

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-base">Appointments by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(168, 55%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">{item.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
