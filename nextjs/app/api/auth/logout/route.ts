import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export const POST = async () => {
    await deleteSession();
    return NextResponse.json({ message: "Logged out" });
};
