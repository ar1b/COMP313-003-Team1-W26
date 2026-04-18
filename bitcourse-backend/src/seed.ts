import 'dotenv/config';
import { db } from "./db/index.js";
import { departments, subjects, classes, enrollments } from "./db/schema/index.js";
import { auth } from "./lib/auth.js";
import { eq } from "drizzle-orm";

async function clearTables() {
    console.log("Clearing existing seed data...");
    await db.delete(enrollments);
    await db.delete(classes);
    await db.delete(subjects);
    await db.delete(departments);
    console.log("Tables cleared.");
}

async function createUser(name: string, email: string, password: string, role: "admin" | "teacher" | "student") {
    try {
        const result = await auth.api.signUpEmail({
            body: { name, email, password, role },
        });
        return result.user;
    } catch {
        // User may already exist — fetch and return
        const { user: existingUser } = await auth.api.signUpEmail({
            body: { name, email, password: password + "_retry", role },
        }).catch(() => ({ user: null }));
        return existingUser;
    }
}

async function seed() {
    await clearTables();

    // ── Departments ────────────────────────────────────────────────────────────
    console.log("Seeding departments...");
    const [cs, math, bio, eng, phys] = await db
        .insert(departments)
        .values([
            { code: "CS", name: "Computer Science", description: "Study of computation, algorithms, and software systems." },
            { code: "MATH", name: "Mathematics", description: "Pure and applied mathematics covering analysis, algebra, and statistics." },
            { code: "BIO", name: "Biology", description: "Life sciences including cellular biology, genetics, and ecology." },
            { code: "ENG", name: "English", description: "Language, literature, and academic writing." },
            { code: "PHYS", name: "Physics", description: "Classical mechanics, electromagnetism, thermodynamics, and modern physics." },
        ])
        .returning();

    console.log(`  Created ${5} departments.`);

    // ── Subjects ───────────────────────────────────────────────────────────────
    console.log("Seeding subjects...");
    const insertedSubjects = await db
        .insert(subjects)
        .values([
            { departmentId: cs!.id, code: "CS101", name: "Introduction to Programming", description: "Fundamentals of programming using Python." },
            { departmentId: cs!.id, code: "CS201", name: "Data Structures & Algorithms", description: "Arrays, linked lists, trees, graphs, and sorting algorithms." },
            { departmentId: cs!.id, code: "CS301", name: "Web Development", description: "HTML, CSS, JavaScript, and modern frameworks." },
            { departmentId: math!.id, code: "MATH101", name: "Calculus I", description: "Limits, derivatives, and integration techniques." },
            { departmentId: math!.id, code: "MATH201", name: "Linear Algebra", description: "Vectors, matrices, determinants, and eigenvalues." },
            { departmentId: bio!.id, code: "BIO101", name: "Cell Biology", description: "Structure and function of eukaryotic and prokaryotic cells." },
            { departmentId: bio!.id, code: "BIO201", name: "Genetics", description: "Heredity, gene expression, and molecular genetics." },
            { departmentId: eng!.id, code: "ENG101", name: "Academic Writing", description: "Essay structure, argumentation, and citation styles." },
            { departmentId: phys!.id, code: "PHYS101", name: "Classical Mechanics", description: "Newton's laws, kinematics, and work-energy theorem." },
            { departmentId: phys!.id, code: "PHYS201", name: "Electromagnetism", description: "Electric and magnetic fields, Maxwell's equations." },
        ])
        .returning();

    console.log(`  Created ${insertedSubjects.length} subjects.`);

    // ── Users ──────────────────────────────────────────────────────────────────
    console.log("Seeding users (this may take a moment)...");

    const adminUser = await createUser("Admin User", "admin@bitcourse.dev", "Password123!", "admin");
    const teacher1  = await createUser("Alice Chen", "alice.chen@bitcourse.dev", "Password123!", "teacher");
    const teacher2  = await createUser("Bob Martinez", "bob.martinez@bitcourse.dev", "Password123!", "teacher");
    const teacher3  = await createUser("Carol Williams", "carol.williams@bitcourse.dev", "Password123!", "teacher");

    const students = await Promise.all([
        createUser("David Kim",       "david.kim@bitcourse.dev",       "Password123!", "student"),
        createUser("Emma Johnson",    "emma.johnson@bitcourse.dev",    "Password123!", "student"),
        createUser("Frank Nguyen",    "frank.nguyen@bitcourse.dev",    "Password123!", "student"),
        createUser("Grace Lee",       "grace.lee@bitcourse.dev",       "Password123!", "student"),
        createUser("Henry Brown",     "henry.brown@bitcourse.dev",     "Password123!", "student"),
        createUser("Isla Davis",      "isla.davis@bitcourse.dev",      "Password123!", "student"),
        createUser("Jack Wilson",     "jack.wilson@bitcourse.dev",     "Password123!", "student"),
        createUser("Kira Thomas",     "kira.thomas@bitcourse.dev",     "Password123!", "student"),
    ]);

    console.log(`  Created admin, 3 teachers, and 8 students.`);

    if (!teacher1?.id || !teacher2?.id || !teacher3?.id) {
        throw new Error("Failed to create teacher users — check Better-auth config.");
    }

    const [cs101, cs201, cs301, math101, math201, bio101, bio201, eng101, phys101, phys201] = insertedSubjects;

    // ── Classes ────────────────────────────────────────────────────────────────
    console.log("Seeding classes...");
    const insertedClasses = await db
        .insert(classes)
        .values([
            {
                name: "Intro to Programming – Section A",
                subjectId: cs101!.id,
                teacherId: teacher1.id,
                inviteCode: "CS101-AA1",
                capacity: 30,
                status: "active",
                description: "Morning section covering Python fundamentals.",
                bannerUrl: "https://placehold.co/600x200/f97316/fff?text=CS101-A",
                schedules: [{ day: "Monday", startTime: "09:00", endTime: "10:30" }, { day: "Wednesday", startTime: "09:00", endTime: "10:30" }],
            },
            {
                name: "Data Structures – Fall",
                subjectId: cs201!.id,
                teacherId: teacher1.id,
                inviteCode: "CS201-FL1",
                capacity: 25,
                status: "active",
                description: "In-depth study of data structures and algorithmic complexity.",
                bannerUrl: "https://placehold.co/600x200/0ea5e9/fff?text=CS201",
                schedules: [{ day: "Tuesday", startTime: "11:00", endTime: "12:30" }, { day: "Thursday", startTime: "11:00", endTime: "12:30" }],
            },
            {
                name: "Web Development Bootcamp",
                subjectId: cs301!.id,
                teacherId: teacher2.id,
                inviteCode: "CS301-WB1",
                capacity: 20,
                status: "active",
                description: "Full-stack web development with React and Node.js.",
                bannerUrl: "https://placehold.co/600x200/22c55e/fff?text=CS301",
                schedules: [{ day: "Monday", startTime: "14:00", endTime: "16:00" }],
            },
            {
                name: "Calculus I – Section B",
                subjectId: math101!.id,
                teacherId: teacher2.id,
                inviteCode: "MATH101-B1",
                capacity: 35,
                status: "active",
                description: "Afternoon section with weekly problem sessions.",
                bannerUrl: "https://placehold.co/600x200/a855f7/fff?text=MATH101",
                schedules: [{ day: "Tuesday", startTime: "13:00", endTime: "14:30" }, { day: "Friday", startTime: "13:00", endTime: "14:30" }],
            },
            {
                name: "Cell Biology Lab",
                subjectId: bio101!.id,
                teacherId: teacher3.id,
                inviteCode: "BIO101-LB1",
                capacity: 20,
                status: "active",
                description: "Hands-on microscopy and cell staining techniques.",
                bannerUrl: "https://placehold.co/600x200/ec4899/fff?text=BIO101",
                schedules: [{ day: "Wednesday", startTime: "14:00", endTime: "17:00" }],
            },
            {
                name: "Classical Mechanics – Advanced",
                subjectId: phys101!.id,
                teacherId: teacher3.id,
                inviteCode: "PHYS101-AV1",
                capacity: 20,
                status: "active",
                description: "Calculus-based mechanics with weekly problem sets.",
                bannerUrl: "https://placehold.co/600x200/64748b/fff?text=PHYS101",
                schedules: [{ day: "Monday", startTime: "10:00", endTime: "11:30" }, { day: "Thursday", startTime: "10:00", endTime: "11:30" }],
            },
        ])
        .returning();

    console.log(`  Created ${insertedClasses.length} classes.`);

    // ── Enrollments ────────────────────────────────────────────────────────────
    console.log("Seeding enrollments...");
    const validStudents = students.filter((s): s is NonNullable<typeof s> => s !== null);
    const [cls0, cls1, cls2, cls3, cls4, cls5] = insertedClasses;

    const enrollmentValues: { studentId: string; classId: number }[] = [];

    // Enroll first 4 students in class 0 (CS101-A)
    for (const s of validStudents.slice(0, 4)) {
        enrollmentValues.push({ studentId: s.id, classId: cls0!.id });
    }
    // Enroll students 2-5 in class 1 (CS201)
    for (const s of validStudents.slice(2, 6)) {
        enrollmentValues.push({ studentId: s.id, classId: cls1!.id });
    }
    // Enroll students 0,1,4,5 in class 2 (CS301)
    for (const s of [validStudents[0], validStudents[1], validStudents[4], validStudents[5]].filter(Boolean) as typeof validStudents) {
        enrollmentValues.push({ studentId: s.id, classId: cls2!.id });
    }
    // Enroll last 4 students in class 3 (MATH101)
    for (const s of validStudents.slice(4)) {
        enrollmentValues.push({ studentId: s.id, classId: cls3!.id });
    }
    // Enroll students 0,2,4 in class 4 (BIO101)
    for (const s of [validStudents[0], validStudents[2], validStudents[4]].filter(Boolean) as typeof validStudents) {
        enrollmentValues.push({ studentId: s.id, classId: cls4!.id });
    }
    // Enroll students 1,3,5 in class 5 (PHYS101)
    for (const s of [validStudents[1], validStudents[3], validStudents[5]].filter(Boolean) as typeof validStudents) {
        enrollmentValues.push({ studentId: s.id, classId: cls5!.id });
    }

    if (enrollmentValues.length > 0) {
        await db.insert(enrollments).values(enrollmentValues);
    }
    console.log(`  Created ${enrollmentValues.length} enrollments.`);

    console.log("\n✅ Seed complete!");
    console.log("\nLogin credentials (password: Password123! for all):");
    console.log(`  Admin:   admin@bitcourse.dev`);
    console.log(`  Teacher: alice.chen@bitcourse.dev`);
    console.log(`  Teacher: bob.martinez@bitcourse.dev`);
    console.log(`  Teacher: carol.williams@bitcourse.dev`);
    console.log(`  Student: david.kim@bitcourse.dev  (and 7 more students)`);
    console.log("\nClass invite codes:");
    insertedClasses.forEach(c => console.log(`  ${c.name}: ${c.inviteCode}`));
}

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    });
