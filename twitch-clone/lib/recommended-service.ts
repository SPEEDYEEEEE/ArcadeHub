import { db } from "./db";
import { getSelf } from "./auth-service";

export const getRecommended = async () => {

    let userId;

    try {
        const self = await getSelf();
    
        if (self instanceof Error) {
            userId = null;
        } else {
            userId = self.id;
        }
    } catch (error) {
        userId = null;
    }

    let users = [];

    if(userId) {
        users = await db.user.findMany({
            where: {
                AND: [
                    {
                        NOT: {
                                id: userId
                            },
                    },
                    {
                        NOT: {
                                followedBy: {
                                    some: {
                                        followerId: userId,
                                    }
                                }
                            }
                    },
                    {
                        NOT: {
                                blocking: {
                                    some: {
                                        blockedId: userId,
                                    }
                                }
                            }
                    }    
                ],           
            },
            include: {
                stream: {
                    select: {
                        isLive: true,
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    } else {
        users = await db.user.findMany({
            include: {
                stream: {
                    select: {
                        isLive: true,
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    }

    return users;
}

// await new Promise(resolve => setTimeout(resolve, 5000));