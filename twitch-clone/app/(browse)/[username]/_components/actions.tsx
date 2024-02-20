"use client"

import { onBlock, onUnblock,  } from "@/actions/block";
import { onFollow, onUnFollow } from "@/actions/follow"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner";

interface ActionsProps {
    isFollowing: boolean;
    isBlocking: boolean;
    userId: string;
};


export const Actions = ({ isFollowing, userId, isBlocking }: ActionsProps) => {
    const [isPending, startTransition] = useTransition();
  
    const handleFollow = () => {
      startTransition(() => {
        onFollow(userId)
          .then((data) => {
            if (data && data.following) {
              toast.success(`You are now following user: ${data.following.username}`);
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
    };
  
    const handleUnfollow = () => {
      startTransition(() => {
        onUnFollow(userId)
          .then((data) => {
            if (data && data.following) {
              toast.success(`You have unfollowed user: ${data.following.username}`);
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
    };
  
    const handleBlock = () => {
      startTransition(() => {
        onBlock(userId)
          .then((data) => {
            if (data && data.blocked) {
              toast.success(`You have blocked user: ${data.blocked.username}`);
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
    };
  
    const handleUnblock = () => {
      startTransition(() => {
        onUnblock(userId)
          .then((data) => {
            if (data && data.blocked) {
              toast.success(`You have unblocked user: ${data.blocked.username}`);
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
    };
  
    return (
      <>
        <Button disabled={isPending || !isFollowing} onClick={handleUnfollow} variant="primary">
          Unfollow
        </Button>
        <Button disabled={isPending || isFollowing} onClick={handleFollow} variant="primary">
          Follow
        </Button>
        <Button onClick={handleBlock} disabled={isPending}>
          Block
        </Button>
        <Button onClick={handleUnblock} disabled={isPending}>
          Unblock
        </Button>
      </>
    );
  };
  
