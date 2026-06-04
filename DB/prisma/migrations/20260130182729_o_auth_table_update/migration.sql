-- AlterTable
ALTER TABLE "oauth_accounts" ADD COLUMN     "accessTokenIv" TEXT,
ADD COLUMN     "refreshTokenIv" TEXT;
