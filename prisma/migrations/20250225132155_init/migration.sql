/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socketID]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sessionId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "chatId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Session_socketID_key" ON "Session"("socketID");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
