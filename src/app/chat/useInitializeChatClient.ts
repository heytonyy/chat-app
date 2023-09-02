import { useUser } from "@clerk/nextjs";
import { env } from "@/env";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function useInitializeChatClient() {
  // get user from Clerk
  const { user } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    // If the user is not authenticated, return
    if (!user?.id) return;

    const client = StreamChat.getInstance(env.NEXT_PUBLIC_STREAM_KEY);

    client
      .connectUser(
        {
          id: user.id,
          name: user.fullName || user.id,
          image: user.imageUrl,
        },
        // Get a Stream token from our API server
        async () => {
          const response = await fetch("/api/get-token");
          if (!response.ok) {
            throw new Error("Failed to get token");
          }
          const body = await response.json();
          return body.token;
        }
      )
      .catch((error) => console.error("Failed to connect", error))
      .then(() => setChatClient(client));

    return () => {
      // Disconnect the user when the component unmounts
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Disconnected user"));
    };
  }, [user?.id, user?.fullName, user?.imageUrl]); // Reconnect if the user ID changes

  // Return the chat client to the component
  return chatClient;
}
