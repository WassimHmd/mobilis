import { io as Client } from "socket.io-client";
import io, { userSockets } from "src/config/socket";
import { strict as assert } from "assert";
import { NotificationObject } from "../types";
import { notifyUser } from "../utils/notificationUtils";

describe("Socket.IO Server", () => {
  let clientSocket: any;

  before((done) => {
    // Setup server
    io.listen(3000);
    // Setup client
    clientSocket = Client("http://localhost:3000");
    clientSocket.emit("register", { userId: "clzphgugk0000ecafhzzcq0vh" });

    setTimeout(done, 200);
  });

  after((done) => {
    clientSocket.close();
    io.close();
    done();
  });

  it("should get hello", (done) => {
    const testMessage = "hello";

    clientSocket.on("notification", (notification: NotificationObject) => {
      assert.equal(notification.message, "testMessage");
      console.log("reached this point");
      done();
    });

    notifyUser({
      targetId: "clzphgugk0000ecafhzzcq0vh",
      title: "testMessage",
      message: "testMessage",
      payload: {},
    });
  });
});
