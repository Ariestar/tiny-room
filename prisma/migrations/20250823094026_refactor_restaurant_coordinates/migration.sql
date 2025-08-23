/*
  Warnings:

  - You are about to drop the column `latitude` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "coordinates" DOUBLE PRECISION[];
