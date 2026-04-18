import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";
import { BookOpen, GraduationCap, Layers, Users } from "lucide-react";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowButton } from "@/components/refine-ui/buttons/show";

type DepartmentShowData = {
    department: {
        id: number;
        code: string;
        name: string;
        description?: string;
    };
    totals: {
        subjects: number;
        classes: number;
        enrolledStudents: number;
    };
};

type SubjectRow = { id: number; code: string; name: string; description?: string };
type ClassRow = {
    id: number;
    name: string;
    status: string;
    capacity: number;
    subject?: { name: string };
    teacher?: { name: string };
};

const DepartmentsShow = () => {
    const { id } = useParams();
    const departmentId = id ?? "";

    const { query } = useShow<DepartmentShowData>({
        resource: "departments",
    });

    const data = query.data?.data;
    const department = data?.department;
    const totals = data?.totals;

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
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
            },
            {
                id: "description",
                accessorKey: "description",
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => (
                    <span className="text-sm text-muted-foreground truncate line-clamp-2">
                        {getValue<string>() ?? "—"}
                    </span>
                ),
            },
            {
                id: "details",
                size: 120,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton resource="subjects" recordItemId={row.original.id} variant="outline" size="sm">
                        View
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const classColumns = useMemo<ColumnDef<ClassRow>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 220,
                header: () => <p className="column-title">Class Name</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
            },
            {
                id: "subject",
                accessorKey: "subject.name",
                size: 180,
                header: () => <p className="column-title">Subject</p>,
                cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>() ?? "—"}</Badge>,
            },
            {
                id: "teacher",
                accessorKey: "teacher.name",
                size: 180,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>() ?? "—"}</span>,
            },
            {
                id: "status",
                accessorKey: "status",
                size: 100,
                header: () => <p className="column-title">Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>;
                },
            },
            {
                id: "capacity",
                accessorKey: "capacity",
                size: 100,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({ getValue }) => <span>{getValue<number>()}</span>,
            },
            {
                id: "details",
                size: 120,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">
                        View
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const subjectsTable = useTable<SubjectRow>({
        columns: subjectColumns,
        refineCoreProps: {
            resource: `departments/${departmentId}/subjects`,
            pagination: { pageSize: 5, mode: "server" },
        },
    });

    const classesTable = useTable<ClassRow>({
        columns: classColumns,
        refineCoreProps: {
            resource: `departments/${departmentId}/classes`,
            pagination: { pageSize: 5, mode: "server" },
        },
    });

    if (query.isLoading || query.isError || !department) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="departments" title="Department Details" />
                <p className="state-message">
                    {query.isLoading
                        ? "Loading department details..."
                        : query.isError
                            ? "Failed to load department details."
                            : "Department not found."}
                </p>
            </ShowView>
        );
    }

    const stats = [
        { label: "Subjects", value: totals?.subjects ?? 0, icon: BookOpen, accent: "text-purple-600" },
        { label: "Classes", value: totals?.classes ?? 0, icon: Layers, accent: "text-blue-600" },
        { label: "Enrolled Students", value: totals?.enrolledStudents ?? 0, icon: Users, accent: "text-emerald-600" },
    ];

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="departments" title="Department Details" />

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge className="mb-2">{department.code}</Badge>
                            <CardTitle className="text-2xl">{department.name}</CardTitle>
                            {department.description && (
                                <p className="text-muted-foreground mt-1 text-sm">{department.description}</p>
                            )}
                        </div>
                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
                                    <stat.icon className={`h-4 w-4 ${stat.accent}`} />
                                </div>
                                <div className="mt-2 text-2xl font-semibold">{stat.value}</div>
                            </div>
                        ))}
                    </div>
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

            <Card>
                <CardHeader>
                    <CardTitle>Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={classesTable} />
                </CardContent>
            </Card>
        </ShowView>
    );
};

export default DepartmentsShow;
