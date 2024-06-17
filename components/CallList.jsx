"use client";
import React, { useEffect, useState } from "react";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useRouter } from "next/navigation";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";
import Loader from "./Loader";

export default function CallList({ type }) {
  const { endedCalls, upcomingCalls, isLoading, callRecordings } =
    useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState([]);
  const [load, setLoad] = useState(false);
  const { toast } = useToast();
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      setLoad(true);
      if (!callRecordings) return;
      const callData = await Promise.all(
        callRecordings?.map((meeting) => {
          return meeting.queryRecordings() ?? [];
        })
      );
      const recordings = callData
        ?.filter((call) => call.recordings.length > 0)
        ?.flatMap((call) => call.recordings);
      setRecordings(recordings);
      setLoad(false);
    };
    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  if (isLoading || load) return <Loader></Loader>;
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting, index) => {
          return (
            <MeetingCard
              key={meeting.id ?? index}
              icon={
                type === "ended"
                  ? "/icons/previous.svg"
                  : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
              }
              title={
                meeting.state?.custom?.description ||
                meeting.filename?.substring(0, 20) ||
                "No Description"
              }
              date={
                meeting.state?.startsAt?.toLocaleString() ||
                meeting.start_time?.toLocaleString()
              }
              isPreviousMeeting={type === "ended"}
              link={
                type === "recordings"
                  ? meeting.url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
              }
              buttonIcon1={
                type === "recordings" ? "/icons/play.svg" : undefined
              }
              buttonText={type === "recordings" ? "Play" : "Start"}
              handleClick={
                type === "recordings"
                  ? () => router.push(`${meeting.url}`)
                  : () => router.push(`/meeting/${meeting.id}`)
              }
            />
          );
        })
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
}
