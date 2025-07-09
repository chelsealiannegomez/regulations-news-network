import { z } from "zod";

const rawValue = process.env.NEXT_PUBLIC_NUM_ARTICLES_PER_PAGE;

export const NUM_ARTICLES_PER_PAGE = z
    .string()
    .transform((val) => (val !== undefined ? Number(val) : 4))
    .parse(rawValue);
