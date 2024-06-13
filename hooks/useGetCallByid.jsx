import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect } from "react";
import { useState } from "react";
import { useToast } from "@components/ui/use-toast";
export const useGetCallByid = (id) => {
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const client = useStreamVideoClient();
  const toast = useToast();
  useEffect(() => {
    if (!client) {
      toast({
        title: "No Client Found",
      });
      return;
    }
    const loadCall = async () => {
      console.log(await client.queryCalls())
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });
      if (calls.length > 0) {
        setCall(calls[0]);
      }
      setIsLoading(false);
    };
    loadCall();
  }, [client, id]);
  return [call, isLoading];
};
