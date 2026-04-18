import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";
import { Mail, ShieldCheck } from "lucide-react";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types";

type DeptRow = { id: number; code: string; name: string; description?: string };
type SubjectRow = { id: number; code: string; name: string; department?: { name: string } };

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
    admin: "default",
    teacher: "secondary",
    student: "outline",
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

const UsersShow = () => {
    const { id } = useParams();
    const userId = id ?? "";

    const { query } = useShow<User>({ resource: "users" });
    const user = query.data?.data;

    const deptColumns = useMemo<ColumnDef<DeptRow>[]>(
        () => [
            {
                id: "code",
                accessorKey: "code",
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge className="ml-2">{getValue<string>()}</Badge>,
            },
            {
                id: "name",
                accessorKey: "name",
                size: 220,
                header: () => <p className="column-title">Department</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
            },
            {
                id: "description",
                accessorKey: "description",
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => (
                    <span className="text-sm text-muted-foreground">{getValue<string>() ?? "—"}</span>
                ),
            },
        ],
        []
    );

    const subjectColumns = useMemo<ColumnDef<SubjectRow>[]>(
        () => [
            {
                id: "code",
                accessorKey: "code",
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge className="ml-2">{getValue<string>()}</Badge>,
            },
            {
                id: "name",
                accessorKey: "name",
                size: 220,
                header: () => <p className="column-title">Subject</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
            },
            {
                id: "department",
                accessorKey: "department.name",
                size: 200,
                header: () => <p className="column-title">Department</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<string>() ?? "—"}</Badge>
                ),
            },
        ],
        []
    );

    const deptsTable = useTable<DeptRow>({
        columns: deptColumns,
        refineCoreProps: {
            resource: `users/${userId}/departments`,
            pagination: { pageSize: 5, mode: "server" },
        },
    });

    const subjectsTable = useTable<SubjectRow>({
        columns: subjectColumns,
        refineCoreProps: {
            resource: `users/${userId}/subjects`,
            pagination: { pageSize: 5, mode: "server" },
        },
    });

    if (query.isLoading || query.isError || !user) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="users" title="User Details" />
                <p className="state-message">
                    {query.isLoading
                        ? "Loading user details..."
                        : query.isError
                            ? "Failed to load user details."
                            : "User not found."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="users" title="User Details" />

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="size-16">
                            {user.image && <AvatarImage src={user.image} alt={user.name} />}
                            <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <Badge variant={roleVariant[user.role] ?? "outline"} className="capitalize">
                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            {user.createdAt && (
                                <p className="text-xs text-muted-foreground">
                                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Departments</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={deptsTable} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={subjectsTable} />
                </CardContent>
            </Card>
        </ShowView>
    );
};

export default UsersShow;
