/*
  Warnings:

  - You are about to drop the column `owner` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `_ChatToMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_owner_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_B_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "owner",
ADD COLUMN     "chatId" INTEGER,
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ChatToMessage";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
