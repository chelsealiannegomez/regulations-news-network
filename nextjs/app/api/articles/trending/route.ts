import prisma from "@/lib/prisma";
import type { Log } from "@/lib/types";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const numDays = 10;
        const daysSinceSeen = new Date();
        daysSinceSeen.setDate(daysSinceSeen.getDate() - numDays);
        const logs: Log[] =
            (await prisma.log.findMany({
                where: {
                    time: {
                        gte: daysSinceSeen,
                    },
                },
            })) || [];

        const map = new Map();

        if (!logs) {
            return NextResponse.json({ results: [] }, { status: 400 });
        }

        if (logs) {
            for (const log of logs) {
                if (map.has(log.article_id)) {
                    map.set(log.article_id, map.get(log.article_id) + 1);
                } else {
                    map.set(log.article_id, 1);
                }
            }
        }

        const sortedLogs = [...map].sort((a, b) => b[1] - a[1]);

        const lastId = sortedLogs.length >= 10 ? 10 : sortedLogs.length;

        const ids = sortedLogs.map((a) => a[0]).slice(0, lastId);

        const trending = await prisma.article.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        if (trending) {
            const articleMap = new Map(
                trending.map((article) => [article.id, article])
            );

            if (ids) {
                const orderedTrending = ids
                    .map((id) => articleMap.get(id))
                    .filter(Boolean);

                return NextResponse.json(
                    { results: orderedTrending },
                    { status: 200 }
                );
            }
        }

        return NextResponse.json({ results: [] }, { status: 400 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ results: [] }, { status: 400 });
    }
};
