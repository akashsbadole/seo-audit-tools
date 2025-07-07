/*
  Warnings:

  - You are about to drop the column `userId` on the `ContactRequest` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ContactRequest_userId_idx";

-- AlterTable
ALTER TABLE "ContactRequest" DROP COLUMN "userId";
