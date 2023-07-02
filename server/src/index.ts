import * as trpc from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

var cors = require("cors");

const prisma = new PrismaClient();

const app = express();

app.use(cors());

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

const appRouter = router({
  // getTasks
  getTasks: publicProcedure.query(async () => {
    return await prisma.tasks.findMany();
  }),
  createTask: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      return await prisma.tasks.create({
        data: {
          name: opts.input.name,
          done: false,
        },
      });
    }),
  deleteTask: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (opts) => {
      return await prisma.tasks.delete({
        where: {
          id: opts.input.id,
        },
      });
    }),
  completeTask: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      let task = await prisma.tasks.findUnique({
        where: {
          id: opts.input.id,
        },
        select: {
          done: true,
        },
      });

      return await prisma.tasks.update({
        where: {
          id: opts.input.id,
        },
        data: {
          done: !task!.done,
        },
      });
    }),
  updateTaskName: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      return await prisma.tasks.update({
        where: {
          id: opts.input.id,
        },
        data: {
          name: opts.input.name,
        },
      });
    }),
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export type AppRouter = typeof appRouter;
app.listen(4000);
