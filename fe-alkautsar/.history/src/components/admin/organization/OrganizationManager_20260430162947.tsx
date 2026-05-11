import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { organizations } from "../db/schema";

const text = (value: unknown) => String(value ?? "").trim();
const toId = (value: unknown) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const asRecord = (value: unknown) => (isRecord(value) ? value : {});
const asRecordArray = (value: unknown) =>
    Array.isArray(value) ? value.filter(isRecord) : [];

const mapOrganization = (row: typeof organizations.$inferSelect) => ({
    id: String(row.id),
    title: row.title,
    subtitle: row.subtitle,
    head: asRecord(row.head),
    leaders: asRecordArray(row.leaders),
    sections: asRecordArray(row.sections),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
});

const emptyOrganization = {
    title: "",
    subtitle: "",
    head: {},
    leaders: [],
    sections: []
};

const handleError = (code: string, message: string, res: Response, error: unknown) => {
    console.error(code, error);
    return res.status(500).json({ message });
};

const validatePayload = (body: Record<string, unknown>) => {
    const title = text(body.title);
    const subtitle = text(body.subtitle);
    const head = asRecord(body.head);
    const leaders = asRecordArray(body.leaders);
    const sections = asRecordArray(body.sections);

    if (!title || !subtitle) {
        return {
            error: "Field title dan subtitle wajib diisi"
        };
    }

    return {
        payload: {
            title,
            subtitle,
            head,
            leaders,
            sections
        }
    };
};

const getLatestOrganization = async () => {
    const rows = await db
        .select()
        .from(organizations)
        .orderBy(desc(organizations.updatedAt), desc(organizations.id))
        .limit(1);

    return rows[0] ?? null;
};

export const getOrganizationContent = async (_: Request, res: Response) => {
    try {
        const organization = await getLatestOrganization();

        return organization
            ? res.json(mapOrganization(organization))
            : res.json(emptyOrganization);
    } catch (error) {
        return handleError(
            "GET_ORGANIZATION_CONTENT_ERROR",
            "Terjadi kesalahan saat mengambil konten organization",
            res,
            error
        );
    }
};

export const getOrganizationDetail = async (req: Request, res: Response) => {
    try {
        const id = toId(req.params.id);
        if (!id) return res.status(400).json({ message: "ID organization tidak valid" });

        const rows = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, id))
            .limit(1);

        return rows[0]
            ? res.json(mapOrganization(rows[0]))
            : res.status(404).json({ message: "Organization tidak ditemukan" });
    } catch (error) {
        return handleError(
            "GET_ORGANIZATION_DETAIL_ERROR",
            "Terjadi kesalahan saat mengambil detail organization",
            res,
            error
        );
    }
};

export const createOrganization = async (req: Request, res: Response) => {
    try {
        const body = asRecord(req.body);
        console.log(body)
        const { payload, error } = validatePayload(body);

        if (error || !payload) {
            return res.status(400).json({ message: error });
        }

        const inserted = await db
            .insert(organizations)
            .values(payload)
            .returning();

        return res.status(201).json(mapOrganization(inserted[0]));
    } catch (error) {
        return handleError(
            "CREATE_ORGANIZATION_ERROR",
            "Terjadi kesalahan saat menambah organization",
            res,
            error
        );
    }
};

export const updateOrganization = async (req: Request, res: Response) => {
    try {
        const body = asRecord(req.body);
        const paramId = toId(req.params.id);
        const bodyId = toId(body.id);
        const id = paramId ?? bodyId;
        const { payload, error } = validatePayload(body);

        if (error || !payload) {
            return res.status(400).json({ message: error });
        }

        if (!id) {
            const latest = await getLatestOrganization();

            if (!latest) {
                const inserted = await db
                    .insert(organizations)
                    .values(payload)
                    .returning();

                return res.status(201).json(mapOrganization(inserted[0]));
            }

            const updatedLatest = await db
                .update(organizations)
                .set({
                    ...payload,
                    updatedAt: new Date()
                })
                .where(eq(organizations.id, latest.id))
                .returning();

            return res.json(mapOrganization(updatedLatest[0]));
        }

        const updated = await db
            .update(organizations)
            .set({
                ...payload,
                updatedAt: new Date()
            })
            .where(eq(organizations.id, id))
            .returning();

        return updated[0]
            ? res.json(mapOrganization(updated[0]))
            : res.status(404).json({ message: "Organization tidak ditemukan" });
    } catch (error) {
        return handleError(
            "UPDATE_ORGANIZATION_ERROR",
            "Terjadi kesalahan saat mengubah organization",
            res,
            error
        );
    }
};

export const deleteOrganization = async (req: Request, res: Response) => {
    try {
        const id = toId(req.params.id);
        if (!id) return res.status(400).json({ message: "ID organization tidak valid" });

        const deleted = await db.delete(organizations).where(eq(organizations.id, id)).returning();

        return deleted[0]
            ? res.json({ message: "Organization berhasil dihapus" })
            : res.status(404).json({ message: "Organization tidak ditemukan" });
    } catch (error) {
        return handleError(
            "DELETE_ORGANIZATION_ERROR",
            "Terjadi kesalahan saat menghapus organization",
            res,
            error
        );
    }
};
