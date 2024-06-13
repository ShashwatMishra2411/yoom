"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { tokenProvider } from "../actions/stream.actions"; // Ensure this returns a valid token
import Loader from "@components/Loader";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const StreamClientProvider = ({ children }) => {
  const [videoClient, setVideoClient] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    if (!apiKey) {
      throw new Error("Stream API key is required");
    }

    const userObj = {
      id: user?.id,
      name: user?.username || user?.id,
      image: user?.imageUrl,
    };

    const initializeClient = async () => {
      try {
        const token = await tokenProvider(user.id); // Ensure tokenProvider is async if it fetches token and provide user id
        const client = new StreamVideoClient({ apiKey, user: userObj, token });
        await client.connectUser({ id: user.id, name: user.fullName, image: user.imageUrl, token });
        setVideoClient(client);
      } catch (error) {
        console.error("Failed to initialize Stream Video client:", error);
      }
    };

    initializeClient();
  }, [user, isLoaded]);

  if (!videoClient) {
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
