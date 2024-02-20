"use client";

import { toast } from "sonner";
import { useTransition } from "react";

import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";

interface UnblockButtonProps {
  userId: string;
}

export const UnblockButton = ({ userId }: UnblockButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((result) => {
          if (result && result.blocked) {
            toast.success(`User ${result.blocked.username} unblocked`);
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={onClick}
      variant="link"
      size="sm"
      className="text-blue-500 w-full"
    >
      Unblock
    </Button>
  );
};
