import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "@app/server/api/trpc";

export const exampleRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string(), multiplier: z.number() }))
		.query(({ input }) => {
			return {
				greeting: `Hello  asd ${input.text}`,
				asd: input.text.length * input.multiplier,
			};
		}),

	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.example.findMany();
	}),
	clickCount: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.clickCount.findUnique({ where: { id: "12" } });
	}),
	click: publicProcedure.mutation(async ({ ctx }) => {
		const ws = await ctx.prisma.clickCount.upsert({
			where: {
				id: "12",
			},
			create: {
				id: "12",
				count: 1,
			},
			update: {
				count: {
					increment: 1,
				},
			},
		});

		return ws.count;
	}),
	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
