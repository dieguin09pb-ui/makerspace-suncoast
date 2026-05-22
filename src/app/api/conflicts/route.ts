import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { conflictSchema, SchedulingConflict, Quarter } from "@/lib/types";
import { getConflicts, appendConflict } from "@/lib/blob";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const quarterParam = searchParams.getAll("quarter") as Quarter[];

  const conflicts = await getConflicts();

  const filtered =
    quarterParam.length > 0
      ? conflicts.filter((c) =>
          c.quartersAffected.some((q) => quarterParam.includes(q))
        )
      : conflicts;

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = conflictSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const conflict: SchedulingConflict = {
      id: nanoid(),
      submittedAt: new Date().toISOString(),
      ...parsed.data,
    };

    await appendConflict(conflict);

    return NextResponse.json(conflict, { status: 201 });
  } catch (err) {
    console.error("POST /api/conflicts error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
