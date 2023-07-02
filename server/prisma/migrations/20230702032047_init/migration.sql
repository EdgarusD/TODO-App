-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
