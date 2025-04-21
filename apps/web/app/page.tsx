import { client } from "@repo/db/client";
import React from "react";

// export const revalidate = 30; // Revalidate every 30 seconds
// or use the following instead if you want always-fresh data:
export const dynamic = 'force-dynamic';
// if you dont understand this thing that read web.md from explanation folder

interface user {
  id: string;
  username: string;
}

export default async function Home() {
  const users = await client.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });
  

  return (
    <div>
      <b>---------------------------------:Users List:---------------------------------</b>
      {users?.map((user: user) => (
        <div key={user.id}>
          <strong>User id:</strong> {user.id} <br />
          <strong>Username:</strong> {user.username} 
        </div>
      ))}
    </div>
  );
}