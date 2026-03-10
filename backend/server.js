import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import { createServer } from "http";
import { initSocket } from "./socket/socket.js";

connectDB();

const server = createServer(app);

initSocket(server);

server.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});