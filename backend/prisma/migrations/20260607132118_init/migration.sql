-- CreateTable
CREATE TABLE "specialities" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(500),
    "icon" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isdeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialities_title_key" ON "specialities"("title");

-- CreateIndex
CREATE INDEX "idx_speciality_isDeleted" ON "specialities"("isdeleted");

-- CreateIndex
CREATE INDEX "idx_speciality_title" ON "specialities"("title");
