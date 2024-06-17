"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EndCallButton from "@components/EndCallButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import {
  CallControls,
  CallParticipantsList,
  PaginatedGridLayout,
  CallStatsButton,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
  CallingState,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import cn from "classnames";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

export default function MeetingRoom() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();
  const call = useCall();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState("speaker-left");
  const [showParticipants, setShowParticipants] = useState(true);
  if (callingState !== CallingState.JOINED) return <Loader />;
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };
  return (
    <section className="relative overflow-hidden min-h-screen w-full pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList
            onClose={() => {
              setShowParticipants(false);
            }}
          />
        </div>
      </div>
      <div className="fixed flex-wrap bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls
          onLeave={() => {
            call.camera.disable();
            call.microphone.disable();
            router.push("/");
          }}
        />
        <Tooltip>
          <DropdownMenu>
            <div className="flex items-center">
              <TooltipTrigger>
                <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                  <LayoutList size={20} className="text-white"></LayoutList>
                </DropdownMenuTrigger>
              </TooltipTrigger>
            </div>
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white flex justify-center flex-col">
              {["Grid", "Speaker-Right", "Speaker-Left"].map((item, index) => {
                return (
                  <div key={index}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        console.log(item.toLowerCase());
                        setLayout(item.toLowerCase());
                      }}
                    >
                      <DropdownMenuLabel className="text-center w-full">
                        {item}
                      </DropdownMenuLabel>
                    </DropdownMenuItem>
                  </div>
                );
              })}
              <DropdownMenuSeparator className="border-dark-1" />
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipContent>Call Layout</TooltipContent>
        </Tooltip>
        <CallStatsButton></CallStatsButton>
        <button
          onClick={() => {
            setShowParticipants((prev) => {
              return !prev;
            });
          }}
        >
          <Tooltip>
            <TooltipTrigger>
              <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <Users size={20} className="text-white"></Users>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {showParticipants ? "Hide Participants" : "Show Participants"}
            </TooltipContent>
          </Tooltip>
        </button>

        {!isPersonalRoom && <EndCallButton></EndCallButton>}
      </div>
    </section>
  );
}
