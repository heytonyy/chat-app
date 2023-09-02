import { env } from "@/env";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

// GET: /api/get-token
// This is the API route that will be called by the client to get a Stream token
export async function GET() {
  try {
    const user = await currentUser();

    console.log("Getting token for user", user?.id);

    // If the user is not authenticated, return a 401
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Create a Stream client
    const streamClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_KEY,
      env.STREAM_SECRET
    );

    // for a more secure token, use a expiration time and issued at time when generating the token
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000);

    const token = streamClient.createToken(user.id, expirationTime, issuedAt);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
