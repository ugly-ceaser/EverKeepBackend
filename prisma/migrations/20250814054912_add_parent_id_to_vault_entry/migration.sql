-- AlterTable
ALTER TABLE "VaultEntry" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "VaultEntry_parentId_idx" ON "VaultEntry"("parentId");

-- AddForeignKey
ALTER TABLE "VaultEntry" ADD CONSTRAINT "VaultEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "VaultEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
