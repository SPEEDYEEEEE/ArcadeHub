import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";

import { StreamPlayer } from "@/components/stream-player";
import { isBlockedByUser } from "@/lib/blocked-service";
//import { Actions } from "./_components/actions";

interface UserPageProps {
  params: {
    username: string;
  };
};

const UserPage = async ({
  params
}: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user || !user.stream) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);
  const isBlocked = await isBlockedByUser(user.id);

  if (isBlocked) {
    notFound();
  }

  return ( 
    <>
      <StreamPlayer
        user={user}
        stream={user.stream}
        isFollowing={isFollowing}
      />
      {/* <div className="flex flex-col gap-y-4">
        <p>username: {user.username}</p>
        <p>userId: {user.id}</p>
        <p>isFollowing: {`${isFollowing}`}</p>
        <p>isBloackedBy: {`${isBlocked}`}</p>
        <Actions userId={user.id} isFollowing={isFollowing} isBlocking/>
    </div> */}
    </>
  );
}
 
export default UserPage;

