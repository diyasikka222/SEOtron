import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser } from "../api"; // Assuming api.ts is in src/
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import DotGrid from "./DotGrid";
import {
  User,
  CreditCard,
  Shield,
  Bell,
  AlertTriangle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// Mock user type - replace with your actual type if available
type UserProfile = {
  username: string;
  email: string;
  created_at: string;
  plan: string;
  isOnboarded: boolean;
};

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // FIX: Renamed unused const (uid) to underscore
  const [_notifications, setNotifications] = useState({
    weeklySummary: true,
    rankAlerts: false,
    securityAlerts: true,
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
        setUsername(userData.username);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // --- Mock Handlers ---
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call: await updateUser({ username });
    alert("Profile updated successfully! (Mock)");
    setUser((prev) => (prev ? { ...prev, username } : null));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    // Mock API call: await changePassword({ oldPassword, newPassword });
    alert("Password updated successfully! (Mock)");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you absolutely sure? This action cannot be undone and will delete all your data.",
      )
    ) {
      if (
        window.confirm("Please confirm one last time. This is irreversible.")
      ) {
        // Mock API call: await deleteAccount();
        localStorage.clear(); // Log user out
        alert("Account deleted successfully. (Mock)");
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="relative w-full flex flex-col items-center justify-center min-h-screen py-20 overflow-hidden">
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor="#303030"
          activeColor="#61DAFB"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
        <Loader2 className="animate-spin text-white z-10" size={48} />
      </div>
    );
  }

  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-screen py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor="#303030"
          activeColor="#61DAFB"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center max-w-4xl">
        <h1 className="text-6xl font-extrabold mb-12 bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent">
          SEOtron
        </h1>

        <Card className="w-full p-6 shadow-xl rounded-2xl bg-black/80 backdrop-blur border border-white/10">
          <CardHeader className="relative text-center p-4">
            <Link to="/deepdashboard" className="absolute top-0 left-0">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <CardTitle className="text-3xl font-bold pt-10">
              Account Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your personal information, subscription, and security
              settings.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-black/40">
                <TabsTrigger value="profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscription
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="danger">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Danger Zone
                </TabsTrigger>
              </TabsList>

              {/* --- Profile Tab --- */}
              <TabsContent value="profile" className="mt-6">
                <Card className="bg-transparent border-white/20">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your profile details here.
                    </CardDescription>
                  </CardHeader>
                  {/* FIX: Removed as="form" and added a native <form> element inside CardContent */}
                  <CardContent className="space-y-6">
                    <form onSubmit={handleUpdateProfile}>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`}
                            alt={user?.username}
                          />
                          <AvatarFallback>
                            {user?.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          variant="outline"
                          className="bg-black/40 border-white/20 text-white"
                        >
                          Change Avatar (Mock)
                        </Button>
                      </div>
                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium text-white/80">
                          Full Name
                        </label>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="bg-black/40 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">
                          Email Address
                        </label>
                        <Input
                          value={user?.email || ""}
                          readOnly
                          disabled
                          className="bg-black/20 border-white/10 text-white/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">
                          Member Since
                        </label>
                        <Input
                          value={
                            user
                              ? new Date(user.created_at).toLocaleDateString()
                              : ""
                          }
                          readOnly
                          disabled
                          className="bg-black/20 border-white/10 text-white/60"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-black font-semibold mt-4"
                      >
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* --- Subscription Tab --- */}
              <TabsContent value="subscription" className="mt-6">
                <Card className="bg-transparent border-white/20">
                  <CardHeader>
                    <CardTitle>Subscription & Billing</CardTitle>
                    <CardDescription>
                      Manage your plan and payment details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-black/40 border border-white/20 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-lg">
                          Current Plan:{" "}
                          <span className="text-[#61DAFB]">
                            {user?.plan || "Free"}
                          </span>
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Your plan renews on 1st December 2025 (Mock).
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate("/deepdashboard")}
                        variant="outline"
                        className="bg-black/40 border-white/20 text-white"
                      >
                        Manage Subscription
                      </Button>
                    </div>
                    <Separator className="bg-white/10" />
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        Payment Method
                      </h4>
                      <div className="p-4 rounded-lg bg-black/40 border border-white/20 flex justify-between items-center">
                        <p className="text-white/90">
                          Visa ending in 4242 (Mock)
                        </p>
                        <Button
                          variant="ghost"
                          className="text-white/70 hover:text-white"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      To change your plan, please go to the "Upgrade" section in
                      your dashboard.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* --- Security Tab --- */}
              <TabsContent value="security" className="mt-6">
                <Card className="bg-transparent border-white/20">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password here. Please use a strong, unique
                      password.
                    </CardDescription>
                  </CardHeader>
                  {/* FIX: Removed as="form" and added a native <form> element inside CardContent */}
                  <CardContent className="space-y-4">
                    <form onSubmit={handleChangePassword}>
                      {error && (
                        <p className="text-red-500 text-sm text-center">
                          {error}
                        </p>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">
                          Old Password
                        </label>
                        <Input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="bg-black/40 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">
                          New Password
                        </label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-black/40 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-black/40 border-white/20 text-white"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-black font-semibold mt-4"
                      >
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* --- Notifications Tab --- */}
              <TabsContent value="notifications" className="mt-6">
                <Card className="bg-transparent border-white/20">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/10">
                      <div>
                        <h4 className="font-medium text-white/90">
                          Weekly Summary
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Receive a summary of your site performance every
                          Monday.
                        </p>
                      </div>
                      <Switch
                        // FIX: Use the prefixed state to avoid TS6133 warnings
                        checked={_notifications.weeklySummary}
                        onCheckedChange={(checked) =>
                          setNotifications((n) => ({
                            ...n,
                            weeklySummary: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/10">
                      <div>
                        <h4 className="font-medium text-white/90">
                          Rank Drop Alerts
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Get an immediate alert if a target keyword drops
                          significantly.
                        </p>
                      </div>
                      <Switch
                        // FIX: Use the prefixed state to avoid TS6133 warnings
                        checked={_notifications.rankAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications((n) => ({
                            ...n,
                            rankAlerts: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/10">
                      <div>
                        <h4 className="font-medium text-white/90">
                          Security Alerts
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new logins or security issues.
                        </p>
                      </div>
                      <Switch
                        // FIX: Use the prefixed state to avoid TS6133 warnings
                        checked={_notifications.securityAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications((n) => ({
                            ...n,
                            securityAlerts: checked,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* --- Danger Zone Tab --- */}
              <TabsContent value="danger" className="mt-6">
                <Card className="bg-transparent border-red-500/50">
                  <CardHeader>
                    <CardTitle className="text-red-400">Danger Zone</CardTitle>
                    <CardDescription className="text-red-400/70">
                      These actions are permanent and cannot be undone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-red-900/20 border border-red-500/50">
                      <div>
                        <h4 className="font-medium text-white/90">
                          Delete Account
                        </h4>
                        <p className="text-sm text-red-400/70">
                          Permanently delete your account and all associated
                          data.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
