import z from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_NUM_ARTICLES_PER_PAGE: z.coerce.number(),
});

export const envClientSchema = envSchema.parse({
    NEXT_PUBLIC_NUM_ARTICLES_PER_PAGE:
        process.env.NEXT_PUBLIC_NUM_ARTICLES_PER_PAGE,
});
