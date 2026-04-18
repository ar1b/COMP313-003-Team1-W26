import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

type DepartmentListItem = {
    id: number;
    code: string;
    name: string;
    description?: string;
    totalSubjects?: number;
};

const DepartmentsList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const columns = useMemo<ColumnDef<DepartmentListItem>[]>(
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
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue<string>()}</span>,
            },
            {
                id: "description",
                accessorKey: "description",
                size: 340,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => (
                    <span className="truncate line-clamp-2 text-muted-foreground text-sm">
                        {getValue<string>() ?? "—"}
                    </span>
                ),
            },
            {
                id: "totalSubjects",
                accessorKey: "totalSubjects",
                size: 120,
                header: () => <p className="column-title">Subjects</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<number>() ?? 0}</Badge>
                ),
            },
            {
                id: "details",
                size: 120,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="departments"
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

    const searchFilters = searchQuery
        ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
        : [];

    const departmentsTable = useTable<DepartmentListItem>({
        columns,
        refineCoreProps: {
            resource: "departments",
            pagination: { pageSize: 10, mode: "server" },
            filters: { permanent: searchFilters },
            sorters: { initial: [{ field: "id", order: "desc" }] },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Departments</h1>

            <div className="intro-row">
                <p>Manage academic departments and their associated subjects.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or code..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <CreateButton resource="departments" />
                    </div>
                </div>
            </div>

            <DataTable table={departmentsTable} />
        </ListView>
    );
};

export default DepartmentsList;
