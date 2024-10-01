import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log(`${socket.id} Connected`);
  socket.on("message", (msg) => {
    console.log("[socket] Message received: ", msg);
    socket.send(`Received ${msg}`);
  });

  socket.on("register", ({ userId }: { userId: string }) => {
    console.log(`[socket] Registering user ${userId}`);
    userSockets[userId] = socket.id;
    console.log(userSockets);
    socket.join("users");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export const userSockets: Record<string, string> = {};

export default io;
