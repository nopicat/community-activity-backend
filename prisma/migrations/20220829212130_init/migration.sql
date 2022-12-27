-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL,
    "callbackId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupUser" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER[],
    "comments" INTEGER[],

    CONSTRAINT "GroupUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupUser_groupId_userId_key" ON "GroupUser"("groupId", "userId");
