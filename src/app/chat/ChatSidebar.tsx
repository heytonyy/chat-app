import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import MenuBar from "./MenuBar";
import { UserResource } from "@clerk/types";
import { useCallback } from "react";

// since user is guaranteed to not be null from the chat page.tsx we can use user as a prop
interface ChatSidebarProps {
  user: UserResource; // UserResource is a type from Clerk
  show: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ user, show, onClose }: ChatSidebarProps) {
  // this is a custom channel preview component:
  // the sidebar closes when a channel is selected
  const ChannelPreivewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div
      className={`w-full flex-col md:max-w-[360px] ${show ? "flex" : "hidden"}`}
    >
      <MenuBar />
      {/* Sets up the Channel list for the user with config */}
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        sort={{ last_message_at: -1 }} // New messages at the top
        options={{ state: true, presence: true, limit: 10 }}
        showChannelSearch // Shows the search bar
        additionalChannelSearchProps={{
          searchForChannels: true, // Searches for channels
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } }, // Filters for channels with the user in them
            },
          },
        }}
        Preview={ChannelPreivewCustom} // Sets the custom channel preview component
      />
    </div>
  );
}
