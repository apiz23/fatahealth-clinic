"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

interface Staff {
    id: string;
    user_id: string;
    position: string | null;
    shift: string | null;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
}

interface Doctor {
    id: string;
    user_id: string;
    specialization: string | null;
    created_at: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
}

interface User {
    id: string;
    email: string;
    role: "doctor" | "staff" | null;
    created_at: string;
    staff?: Staff;
    doctor?: Doctor;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        role: "",
        full_name: "",
        phone: "",
        address: "",
        position: "",
        shift: "",
        specialization: "",
    });

    const fetchUsers = async () => {
        try {
            const { data: usersData, error: usersError } = await supabase
                .from("fh_users")
                .select("*");

            if (usersError) throw usersError;

            const { data: staffData, error: staffError } = await supabase
                .from("fh_staffs")
                .select("*");

            if (staffError) throw staffError;

            const { data: doctorData, error: doctorError } = await supabase
                .from("fh_doctors")
                .select("*");

            if (doctorError) throw doctorError;

            const combinedUsers = usersData.map((user) => {
                const staff = staffData.find((s) => s.user_id === user.id);
                const doctor = doctorData.find((d) => d.user_id === user.id);

                return {
                    ...user,
                    staff: staff || undefined,
                    doctor: doctor || undefined,
                };
            });

            setUsers(combinedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            const { error: staffError } = await supabase
                .from("fh_staffs")
                .delete()
                .eq("user_id", userId);

            const { error: doctorError } = await supabase
                .from("fh_doctors")
                .delete()
                .eq("user_id", userId);

            if (staffError && doctorError) {
                throw new Error("Failed to delete associated records");
            }

            const { error: userError } = await supabase
                .from("fh_users")
                .delete()
                .eq("id", userId);

            if (userError) throw userError;

            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    const handleAddUser = async () => {
        try {
            // First create the user
            const { data: userData, error: userError } = await supabase
                .from("fh_users")
                .insert([
                    {
                        email: newUser.email,
                        password: newUser.password,
                        role: newUser.role,
                    },
                ])
                .select()
                .single();

            if (userError) throw userError;

            // Then create the profile based on role
            if (newUser.role === "staff") {
                const { error: staffError } = await supabase
                    .from("fh_staffs")
                    .insert([
                        {
                            user_id: userData.id,
                            full_name: newUser.full_name,
                            phone: newUser.phone,
                            address: newUser.address,
                            position: newUser.position,
                            shift: newUser.shift,
                        },
                    ]);

                if (staffError) throw staffError;
            } else if (newUser.role === "doctor") {
                const { error: doctorError } = await supabase
                    .from("fh_doctors")
                    .insert([
                        {
                            user_id: userData.id,
                            full_name: newUser.full_name,
                            phone: newUser.phone,
                            address: newUser.address,
                            specialization: newUser.specialization,
                        },
                    ]);

                if (doctorError) throw doctorError;
            }

            toast.success("User added successfully");
            setIsAddingUser(false);
            setNewUser({
                email: "",
                password: "",
                role: "",
                full_name: "",
                phone: "",
                address: "",
                position: "",
                shift: "",
                specialization: "",
            });
            fetchUsers();
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Failed to add user");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesRole =
            selectedRole === "all" || user.role === selectedRole;
        const matchesSearch =
            searchQuery === "" ||
            user.staff?.full_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            user.doctor?.full_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.staff?.phone
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            user.doctor?.phone
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesRole && matchesSearch;
    });

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 justify-between items-center flex-1">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Dialog
                            open={isAddingUser}
                            onOpenChange={setIsAddingUser}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to create a new user
                                        account.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            value={newUser.email}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={newUser.password}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={newUser.role}
                                            onValueChange={(value) =>
                                                setNewUser({
                                                    ...newUser,
                                                    role: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="doctor">
                                                    Doctor
                                                </SelectItem>
                                                <SelectItem value="staff">
                                                    Staff
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="full_name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="full_name"
                                            value={newUser.full_name}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    full_name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={newUser.phone}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={newUser.address}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    address: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    {newUser.role === "staff" && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="position">
                                                    Position
                                                </Label>
                                                <Input
                                                    id="position"
                                                    value={newUser.position}
                                                    onChange={(e) =>
                                                        setNewUser({
                                                            ...newUser,
                                                            position:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="shift">
                                                    Shift
                                                </Label>
                                                <Input
                                                    id="shift"
                                                    value={newUser.shift}
                                                    onChange={(e) =>
                                                        setNewUser({
                                                            ...newUser,
                                                            shift: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                    {newUser.role === "doctor" && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="specialization">
                                                Specialization
                                            </Label>
                                            <Input
                                                id="specialization"
                                                value={newUser.specialization}
                                                onChange={(e) =>
                                                    setNewUser({
                                                        ...newUser,
                                                        specialization:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        onClick={handleAddUser}
                                    >
                                        Add User
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Select
                            value={selectedRole}
                            onValueChange={setSelectedRole}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="doctor">Doctors</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <Card key={user.id}>
                        <CardHeader>
                            <CardTitle>
                                {user.staff?.full_name ||
                                    user.doctor?.full_name ||
                                    "N/A"}
                            </CardTitle>
                            <CardDescription className="capitalize">
                                {user.role}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {user.staff?.phone ||
                                        user.doctor?.phone ||
                                        "No phone"}
                                </p>
                            </div>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="default">
                                        View Details
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="p-4">
                                    <SheetHeader>
                                        <SheetTitle>User Details</SheetTitle>
                                        <SheetDescription>
                                            Detailed information about the user
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-4">
                                        <div className="space-y-2">
                                            <h3 className="font-medium">
                                                Basic Information
                                            </h3>
                                            <div className="grid gap-2">
                                                <div>
                                                    <Label className="text-muted-foreground">
                                                        Full Name
                                                    </Label>
                                                    <p>
                                                        {user.staff
                                                            ?.full_name ||
                                                            user.doctor
                                                                ?.full_name ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">
                                                        Email
                                                    </Label>
                                                    <p>{user.email}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">
                                                        Role
                                                    </Label>
                                                    <p className="capitalize">
                                                        {user.role}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">
                                                        Created At
                                                    </Label>
                                                    <p>
                                                        {new Date(
                                                            user.created_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-medium">
                                                Contact Information
                                            </h3>
                                            <div className="grid gap-2">
                                                <div>
                                                    <Label className="text-muted-foreground">
                                                        Phone
                                                    </Label>
                                                    <p>
                                                        {user.staff?.phone ||
                                                            user.doctor
                                                                ?.phone ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">
                                                        Address
                                                    </Label>
                                                    <p>
                                                        {user.staff?.address ||
                                                            user.doctor
                                                                ?.address ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {user.staff && (
                                            <div className="space-y-2">
                                                <h3 className="font-medium">
                                                    Staff Information
                                                </h3>
                                                <div className="grid gap-2">
                                                    <div>
                                                        <Label className="text-muted-foreground">
                                                            Position
                                                        </Label>
                                                        <p>
                                                            {user.staff
                                                                .position ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-muted-foreground">
                                                            Shift
                                                        </Label>
                                                        <p>
                                                            {user.staff.shift ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {user.doctor && (
                                            <div className="space-y-2">
                                                <h3 className="font-medium">
                                                    Doctor Information
                                                </h3>
                                                <div className="grid gap-2">
                                                    <div>
                                                        <Label className="text-muted-foreground">
                                                            Specialization
                                                        </Label>
                                                        <p>
                                                            {user.doctor
                                                                .specialization ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="w-full"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete User
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Are you sure you
                                                            want to delete this
                                                            user?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            the user and all
                                                            associated data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id
                                                                )
                                                            }
                                                            className="bg-red-500 hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
