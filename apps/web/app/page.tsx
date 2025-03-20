import { client } from "@repo/db/client";

export default async function Home() {
  const users = await client.user.findMany();

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          username: {user.username} <br />
          password: {user.password}
        </div>
      ))}
    </div>
  );
}


// export const revalidate = 30 // revalidate every 30 seconds
// or
// export const dynamic = 'force-dynamic'
