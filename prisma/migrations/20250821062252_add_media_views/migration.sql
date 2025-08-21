-- AlterTable
ALTER TABLE "MediaItem" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MediaView" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "dateDay" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaView_mediaId_dateDay_idx" ON "MediaView"("mediaId", "dateDay");

-- CreateIndex
CREATE INDEX "MediaView_ipHash_dateDay_idx" ON "MediaView"("ipHash", "dateDay");

-- CreateIndex
CREATE UNIQUE INDEX "MediaView_mediaId_ipHash_dateDay_key" ON "MediaView"("mediaId", "ipHash", "dateDay");
