"use client";
import { useUser } from "@clerk/nextjs";
import { Chat, LoadingIndicator } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import useInitializeChatClient from "./useInitializeChatClient";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import useWindowSize from "@/hooks/useWindowSize";
import { mdBreakpoint } from "@/utils/tailwind";

export default function ChatPage() {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();

  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= mdBreakpoint;

  // close the chat sidebar when screens increase in size past the md breakpoint
  // to prevent the sidebar from being open when screen decreases in size after
  useEffect(() => {
    if (windowSize.width >= mdBreakpoint) {
      setChatSidebarOpen(false);
    }
  }, [windowSize.width]);

  // close the chat sidebar when a channel is selected
  const handleSidebarOnClose = useCallback(() => {
    setChatSidebarOpen(false);
  }, []);

  // If the chat client or user is not ready, show a loading indicator
  if (!chatClient || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    // background color and padding for the chat page
    <div className="h-screen bg-gray-100 xl:px-20 xl:py-8">
      {/* min width and max width for the chat page with shadow of window */}
      <div className="m-auto flex h-full min-w-[350px] max-w-[1600px] flex-col shadow-sm">
        <Chat client={chatClient}>
          {/* the menu bar */}
          <div className="flex justify-center border-b border-b-[#DBDDE1] p-3 md:hidden ">
            <button onClick={() => setChatSidebarOpen(!chatSidebarOpen)}>
              {!chatSidebarOpen ? (
                <span className="flex items-center gap-1">
                  <Menu /> Menu
                </span>
              ) : (
                <X />
              )}
            </button>
          </div>
          <div className="flex h-full flex-row overflow-y-auto">
            <ChatSidebar
              user={user}
              show={isLargeScreen || chatSidebarOpen}
              onClose={handleSidebarOnClose}
            />
            <ChatChannel
              show={isLargeScreen || !chatSidebarOpen}
              hideChannelOnThread={!isLargeScreen} // hide the channel when a thread is open on small screens
            />
          </div>
        </Chat>
      </div>
    </div>
  );
}
