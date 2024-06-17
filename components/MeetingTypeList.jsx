"use client";

import React, { useState } from "react";
import {Input} from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import ReactDatePicker from "react-datepicker";
import { Textarea } from "@/components/ui/textarea";

export default function MeetingTypeList() {
  // const [date, setDate] = React.useState();
  const [meetingState, setMeetingState] = useState(""); // Add a state to store the meeting type
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: null,
    link: "",
  });
  const [callDetails, setCallDetails] = useState();
  async function createMeeting() {
    if (!user || !client) return;
    try {
      // console.log(user, client);
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create meeting");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "";
      // console.log(call);
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      // console.log("Pushed");
      setCallDetails(call);
      if (!values.description) {
        // console.log("Push");
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Meeting created successfully",
      });
    } catch (error) {
      // console.log();
      toast({
        title: "Failed to create meeting",
        description: error.message,
      });
    }
  }
  const meetingLink = callDetails
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails.id}`
    : "";
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div
        className="bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer"
        onClick={() => {
          setMeetingState("isInstantMeeting");
        }}
      >
        <div className="flex-center glassmorphism size-12 rounded-[10px]">
          <Image
            src="/icons/add-meeting.svg"
            alt="meeting"
            width={27}
            height={27}
          ></Image>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">New Meeting</h1>
          <p className="text-lg font-normal">Start an Instant meeting</p>
        </div>
      </div>
      <div
        className="bg-blue-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer"
        onClick={() => {
          setMeetingState("isScheduleMeeting");
        }}
      >
        <div className="flex-center glassmorphism size-12 rounded-[10px]">
          <Image
            src="/icons/schedule.svg"
            alt="meeting"
            width={27}
            height={27}
          ></Image>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Schedule Meeting</h1>
          <p className="text-lg font-normal">Schedule Your Meeting</p>
        </div>
      </div>
      <div
        className="bg-purple-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer"
        onClick={() => {
          router.push("/recordings");
        }}
      >
        <div className="flex-center glassmorphism size-12 rounded-[10px]">
          <Image
            src="/icons/recordings.svg"
            alt="meeting"
            width={27}
            height={27}
          ></Image>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">View Recordings</h1>
          <p className="text-lg font-normal">
            View your metting recordings here
          </p>
        </div>
      </div>
      <div
        className="bg-yellow-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer"
        onClick={() => {
          setMeetingState("isJoiningMeeting");
        }}
      >
        <div className="flex-center glassmorphism size-12 rounded-[10px]">
          <Image
            src="/icons/join-meeting.svg"
            alt="meeting"
            width={27}
            height={27}
          ></Image>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Join Meeting</h1>
          <p className="text-lg font-normal">Via Invitation Link</p>
        </div>
      </div>
      {!callDetails ? (
        <MeetingModal
          onClose={() => setMeetingState(undefined)}
          isOpen={meetingState === "isScheduleMeeting"}
          title="Schedule a Meeting"
          className="text-center"
          buttontext="Start Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2 5">
            <label
              htmlFor=""
              className="text-sky-2 text-base text-normal leading-[22px]"
            >
              Add a description
              <Textarea
                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => {
                  setValues({ ...values, description: e.target.value });
                }}
              />
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          onClose={() => setMeetingState(undefined)}
          isOpen={meetingState === "isScheduleMeeting"}
          title="Meeting Created"
          className="text-center"
          buttontext="Copy Meeting Link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Meeting link copied to clipboard",
            });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        ></MeetingModal>
      )}
      <MeetingModal
        onClose={() => setMeetingState(undefined)}
        isOpen={meetingState === "isInstantMeeting"}
        title="Start an Instant Meeting"
        className="text-center"
        buttontext="Start Meeting"
        handleClick={createMeeting}
      ></MeetingModal>
      <MeetingModal
        onClose={() => setMeetingState(undefined)}
        isOpen={meetingState === "isJoiningMeeting"}
        title="Type the link to join the meeting here"
        className="text-center"
        buttontext="Join Meeting"
        handleClick={() => {
          router.push(values.link);
        }}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>
    </section>
  );
}
