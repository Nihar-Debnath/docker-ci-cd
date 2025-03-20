When you run `npm run build` in Next.js, your page is being **statically generated at build time**. However, you're using **server-side database fetching (`await client.user.findMany()`)**, which does not work with **Static Site Generation (SSG)** by default.

---

### **🚨 Problem:**
```tsx
export default async function Home() {
  const users = await client.user.findMany(); // ❌ Fetching at build time
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          username: {user.username}
          password: {user.password}
        </div>
      ))}
    </div>
  );
}
```
- `npm run build` generates **static files** at build time.
- **`await client.user.findMany()` runs at build time**, but database queries usually need to run dynamically.
- Next.js **cannot fetch database data at build time unless it remains static**.

---

## **🛠 Fixes**

### **1️⃣ Use `export const dynamic = "force-dynamic";`**
This will **disable SSG** and make the page **always fetch fresh data on every request**.
```tsx
export const dynamic = "force-dynamic"; // ✅ Force Server-side Rendering (SSR)

import { client } from "@repo/db/client";

export default async function Home() {
  const users = await client.user.findMany();
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          username: {user.username}
          password: {user.password}
        </div>
      ))}
    </div>
  );
}
```
✅ **Now `npm run build` will work because the page is no longer statically generated.**  

---

### **2️⃣ Use ISR (`revalidate = 30`) Instead**
If you **want to cache the page** but still update it **every 30 seconds**, use **Incremental Static Regeneration (ISR)**:
```tsx
export const revalidate = 30; // ✅ Rebuild page every 30 seconds

import { client } from "@repo/db/client";

export default async function Home() {
  const users = await client.user.findMany();
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          username: {user.username}
          password: {user.password}
        </div>
      ))}
    </div>
  );
}
```
✅ **Now the page is built statically but will update every 30 seconds.**  
❌ However, if the database changes **more frequently**, this approach might not be the best.

---

### **3️⃣ Convert to a Client Component (if API is available)**
If you need **real-time updates**, you should fetch the data **on the client side** using `useEffect`:
```tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users") // 👈 Create an API route for this
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          username: {user.username}
          password: {user.password}
        </div>
      ))}
    </div>
  );
}
```
✅ **Now, the build won't break because the fetching happens in the browser instead of at build time.**  
❌ Requires an API route (`/api/users`) to handle the database query.

---

## **🚀 Best Option for Your Case?**
- If you need **real-time data** → Use **`export const dynamic = "force-dynamic";`** (**SSR**).
- If data **updates occasionally** → Use **`export const revalidate = 30;`** (**ISR**).
- If data is **user-specific or changes frequently** → Fetch **on the client side** using an API route.

Let me know which one you prefer or if you need further clarification! 🚀🔥