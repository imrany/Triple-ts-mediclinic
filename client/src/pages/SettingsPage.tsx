import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display">Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast({ title: "Profile updated (demo)" }); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input defaultValue={user?.name || ""} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" defaultValue={user?.email || ""} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input defaultValue={user?.role || ""} disabled className="bg-muted" />
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display">Organization</CardTitle>
          <CardDescription>Clinic details and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast({ title: "Organization updated (demo)" }); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Clinic Name</Label>
                <Input defaultValue="Triple TS Mediclinic" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input defaultValue="+254 700 000 000" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input defaultValue="Nairobi, Kenya" />
            </div>
            <Button type="submit">Update Organization</Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/30 animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => toast({ variant: "destructive", title: "Account deletion (demo)" })}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
