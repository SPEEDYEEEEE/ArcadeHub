import { createUploadthing, type FileRouter } from "uploadthing/next";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

type User = {
  id: string;
  username: string;
  imageUrl: string;
  externalUserId: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function isUser(obj: any): obj is User {
  return obj && obj.id !== undefined;
}
 
const f = createUploadthing();
 
export const ourFileRouter = {
  thumbnailUploader: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async () => {
      const self = await getSelf();

      return { user: self }
    })
    .onUploadComplete(async ({ metadata, file }) => {

      if (isUser(metadata.user)) {
        await db.stream.update({
          where: {
            userId: metadata.user.id,
          },
          data: {
            thumbnailUrl: file.url,
          },
        });

        return { fileUrl: file.url };
      } else {
        
        console.error("User information is not available");
        return ;
      }
    })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;


// if (self instanceof Error) {
//     return false; 
// }