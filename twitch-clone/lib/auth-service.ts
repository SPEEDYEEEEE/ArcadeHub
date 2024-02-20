import { currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { User } from "@prisma/client";

export const getSelf = async (): Promise<User | Error> => {
    const self = await currentUser();

    if (!self || !self.username) {
        return new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { externalUserId: self.id },
    });

    if (!user) {
        throw new Error("Not Found");
    }

    return user;
};

export const getSelfByUsername = async (encodedUsername: string) => {
    const username = decodeURIComponent(encodedUsername);

    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { username }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (self.username !== user.username) {
        throw new Error("Unauthorized");
    }

    return user;
};
