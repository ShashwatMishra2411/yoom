import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const isOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;
  if (!isOwner) return null;
  return (
    <Button
      className="rounded-2xl bg-red-600"
      onClick={async () => {
        await call.endCall();
        router.push("/");
      }}
    >
      End Call
    </Button>
  );
}
