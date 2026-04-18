import { db } from "../db/index.js";
import { departments, subjects, } from "../db/schema/index.js";
import {and, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import express from "express";

const router = express.Router();

// Get all subjects with optional search, department filter, and pagination
router.get("/", async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);
        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            );
        }

        if (department) {
            const deptPattern = `%${String(department).replace(/[%_]/g, '\\$&')}%`;
            filterConditions.push(ilike(departments.name, deptPattern));
        }

        const whereClause =
            filterConditions.length > 0 ? and(...filterConditions) : undefined;

        // Count query MUST include the join
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        // Data query
        const subjectsList = await db
            .select({
                ...getTableColumns(subjects),
                department: {
                    ...getTableColumns(departments),
                },
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: subjectsList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            },
        });
    } catch (error) {
        console.error("GET /subjects error:", error);
        res.status(500).json({ error: "Failed to fetch subjects" });
    }
});


router.post("/", async (req, res) => {
    try {
        const { name, code, description, departmentId } = req.body;

        if (!name || !code || !description || !departmentId) {
            return res.status(400).json({ error: "name, code, description, and departmentId are required" });
        }

        const [created] = await db
            .insert(subjects)
            .values({ name, code, description, departmentId: Number(departmentId) })
            .returning();

        if (!created) throw new Error("Insert failed");

        const [withDept] = await db
            .select({
                ...getTableColumns(subjects),
                department: { ...getTableColumns(departments) },
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(eq(subjects.id, created.id));

        res.status(201).json({ data: withDept });
    } catch (error) {
        console.error("POST /subjects error:", error);
        res.status(500).json({ error: "Failed to create subject" });
    }
});

export default router;