import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { User } from "@/types";

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

const UsersList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 240,
                header: () => <p className="column-title ml-2">User</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2 ml-2">
                        <Avatar className="size-8">
                            {row.original.image && (
                                <AvatarImage src={row.original.image} alt={row.original.name} />
                            )}
                            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="font-medium truncate">{row.original.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
                        </div>
                    </div>
                ),
            },
            {
                id: "role",
                accessorKey: "role",
                size: 120,
                header: () => <p className="column-title">Role</p>,
                cell: ({ getValue }) => {
                    const role = getValue<string>();
                    return (
                        <Badge variant={roleVariant[role] ?? "outline"} className="capitalize">
                            {role}
                        </Badge>
                    );
                },
            },
            {
                id: "email",
                accessorKey: "email",
                size: 260,
                header: () => <p className="column-title">Email</p>,
                cell: ({ getValue }) => (
                    <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: "createdAt",
                accessorKey: "createdAt",
                size: 160,
                header: () => <p className="column-title">Joined</p>,
                cell: ({ getValue }) => {
                    const dateStr = getValue<string>();
                    if (!dateStr) return <span className="text-muted-foreground">—</span>;
                    return (
                        <span className="text-sm text-muted-foreground">
                            {new Date(dateStr).toLocaleDateString()}
                        </span>
                    );
                },
            },
            {
                id: "details",
                size: 120,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="users"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const roleFilters =
        selectedRole === "all"
            ? []
            : [{ field: "role", operator: "eq" as const, value: selectedRole }];

    const searchFilters = searchQuery
        ? [{ field: "search", operator: "contains" as const, value: searchQuery }]
        : [];

    const usersTable = useTable<User>({
        columns,
        refineCoreProps: {
            resource: "users",
            pagination: { pageSize: 10, mode: "server" },
            filters: { permanent: [...roleFilters, ...searchFilters] },
            sorters: { initial: [{ field: "id", order: "desc" }] },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Users</h1>

            <div className="intro-row">
                <p>Browse and manage all users in the system.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <DataTable table={usersTable} />
        </ListView>
    );
};

export default UsersList;
