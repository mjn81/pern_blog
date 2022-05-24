-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
