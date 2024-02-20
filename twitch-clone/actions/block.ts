"use server";

import { revalidatePath } from "next/cache";
import { RoomServiceClient } from "livekit-server-sdk";

import { getSelf } from "@/lib/auth-service";
import { blockUser, unblockUser } from "@/lib/blocked-service";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

export const onBlock = async (id: string) => {
    try {
      const self = await getSelf();
  
      // Check if the result is an error
      if ('id' in self) {
        // It's a user object, proceed with the block operation
        const blockedUser = await blockUser(id);
  
        try {
          await roomService.removeParticipant(self.id, id);
        } catch {
          // This means the other user is not in the room
        }
  
        revalidatePath(`/u/${self.username}/community`);
        return blockedUser;
      } else {
        // It's an error, handle the case (e.g., user is a guest)
      }
    } catch (error) {
      // Handle any other errors during the getSelf call
      console.error('Error fetching self:', error);
    }
  };
  
  export const onUnblock = async (id: string) => {
    try {
      const self = await getSelf();
  
      // Check if the result is an error
      if ('id' in self) {
        // It's a user object, proceed with the unblock operation
        const unblockedUser = await unblockUser(id);
  
        revalidatePath(`/u/${self.username}/community`);
        return unblockedUser;
      } else {
        // It's an error, handle the case
      }
    } catch (error) {
      // Handle any other errors during the getSelf call
      console.error('Error fetching self:', error);
    }
  };
  

// export const onBlock = async (id: string) => {

//   const self = await getSelf();

  

//   let blockedUser;

//   try {
//     blockedUser = await blockUser(id);
//   } catch {
//     // This means user is a guest
//   }

//   try {
//     await roomService.removeParticipant(self.id, id);
//   } catch {
//     // This means user is not in the room
//   }

//   revalidatePath(`/u/${self.username}/community`);

//   return blockedUser;
// };

// export const onUnblock = async (id: string) => {
//   const self = await getSelf();
//   const unblockedUser = await unblockUser(id);

//   revalidatePath(`/u/${self.username}/community`);
//   return unblockedUser;
// };