/*
  Warnings:

  - A unique constraint covering the columns `[socketID]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_socketID_key" ON "Session"("socketID");
