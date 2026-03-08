-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'SUCCESS',
ALTER COLUMN "paymentDate" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Payment_memberId_idx" ON "Payment"("memberId");
