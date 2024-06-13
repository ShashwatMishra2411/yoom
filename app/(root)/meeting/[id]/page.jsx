"use client";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import MeetingRoom from "@components/MeetingRoom";
import MeetingSetup from "@components/MeetingSetup";
import { useGetCallByid } from "@hooks/useGetCallByid";
import Loader from "@components/Loader";

export default function Meeting({ params }) {
  const [ call, isLoading ] = useGetCallByid(params.id);
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  if (!isLoaded || isLoading) {
    return <Loader />;
  }
  return (
    <main className="min-h-screen w-ful">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup></MeetingSetup>
          ) : (
            <MeetingRoom></MeetingRoom>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
