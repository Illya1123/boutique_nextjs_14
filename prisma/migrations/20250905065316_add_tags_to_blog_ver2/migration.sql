/*
  Warnings:

  - You are about to alter the column `tags` on the `Blog` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."Blog" ALTER COLUMN "tags" SET DATA TYPE VARCHAR(255)[];
