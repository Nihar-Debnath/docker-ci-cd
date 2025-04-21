import { client } from "@repo/db/client";

Bun.serve({
  port: 8081,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    // @ts-ignore
    async message(ws, message) {
      try {
        const res = JSON.parse(message.toString());

        const response = await client.user.create({
          data: {
            username: res.username,
            password: res.password,
          },
        });

        ws.send(`${response.username} connected`);
      } catch (err) {
        ws.send("Error: Invalid message or DB issue");
        console.error(err);
      }
    },
  },
});


// if you dont understand this thing that read ws.md from explanation folder