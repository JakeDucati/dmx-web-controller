import { Server as HttpServer } from "http";

import { NextApiRequest, NextApiResponse } from "next";
import { SerialPort } from "serialport";

import { Server as SocketIOServer } from "@/node_modules/socket.io";

// Extend the `http.Server` interface to include the `io` property
declare module "http" {
  interface Server {
    io?: SocketIOServer;
  }
}

const PORT_NAME = "COM3"; // DMX adapter location
const BAUD_RATE = 250000; // DMX512 baud rate (250 kbps)
const DMX_CHANNELS = 512;
const UPDATE_RATE_HZ = 30; // 30Hz default

const BREAK_DURATION = 176; // Break duration in microseconds
const MAB_DURATION = 12; // Mark after break duration in microseconds
const FRAME_DELAY = 1000 / UPDATE_RATE_HZ; // Time between frames in milliseconds

export let dmxData = new Uint8Array(DMX_CHANNELS).fill(0); // Initialize DMX data with zeros
let port: SerialPort | null = null;

// Initialize the serial port
async function initializePort() {
  if (port) return; // Already initialized
  port = new SerialPort({
    path: PORT_NAME,
    baudRate: BAUD_RATE,
    dataBits: 8,
    stopBits: 2,
    parity: "none",
    autoOpen: false,
  });

  return new Promise((resolve, reject) => {
    port!.open((err) => {
      if (err) {
        console.error("Error opening serial port:", err.message);

        return reject(err);
      }
      console.log("Serial port opened.");
      resolve(true);
    });
  });
}

// Send DMX data in a loop
let dmxLoopRunning = false;

async function sendDMX() {
  if (dmxLoopRunning) return;
  dmxLoopRunning = true;

  if (!port) await initializePort();

  const sendFrame = () => {
    if (!port || !port.isOpen) return;

    sendBreak(() => {
      sendMarkAfterBreak(() => {
        port!.write(dmxData, (err) => {
          if (err) {
            console.error("Error writing DMX data:", err);
          } else {
            // console.log("Sent DMX frame", dmxData.slice(70, 85));
          }
        });

        setTimeout(sendFrame, FRAME_DELAY);
      });
    });
  };

  sendFrame();
}

// Send the DMX break signal
function sendBreak(callback: () => void) {
  if (!port) return;

  port.set({ brk: true }, (err) => {
    if (err) return console.error("Error during break:", err);
    setTimeout(() => {
      port!.set({ brk: false }, callback);
    }, BREAK_DURATION / 1000);
  });
}

// Send Mark After Break (MAB)
function sendMarkAfterBreak(callback: () => void) {
  setTimeout(callback, MAB_DURATION / 1000);
}

// WebSocket server setup with Socket.IO
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // @ts-ignore
  const server = res.socket?.server as HttpServer | undefined;

  if (!server) {
    res.status(500).send("Server not found");

    return;
  }

  // Check if the Socket.IO server already exists
  if (!server.io) {
    const io = new SocketIOServer(server, {
      path: "/api/socketio", // Custom path for Socket.IO
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
      },
    });

    // Updated connection handler
    io.on("connection", (socket) => {
      console.log("Socket.IO connection established", socket.id);

      socket.on("disconnect", () => {
        console.log("Socket.IO connection closed", socket.id);
      });

      socket.on("dmxUpdate", (data: { channel: number; value: number }) => {
        const { channel, value } = data;

        // Ensure channel is within valid range and value is valid
        if (
          channel >= 0 &&
          channel < DMX_CHANNELS &&
          value >= 0 &&
          value <= 255
        ) {
          dmxData[channel] = value; // Update only the specific channel
        } else {
          console.warn(
            "Received invalid DMX channel or value:",
            channel,
            value,
          );
        }
      });
    });

    console.log("Socket.IO server started");
    server.io = io; // Store the Socket.IO server instance on the HTTP server
  }

  res.end();

  // Start sending DMX if not already running
  await sendDMX();
}
