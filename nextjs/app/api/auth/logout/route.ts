import { NextResponse, NextRequest } from "next/server";
import { deleteSession } from "@/lib/session";

export const POST = async (request: NextRequest) => {
    await deleteSession();
    return NextResponse.json({ message: "Logged out" });
};
