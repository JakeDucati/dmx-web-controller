import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from '@/node_modules/socket.io';
import { SerialPort } from 'serialport';

// Extend the `http.Server` interface to include the `io` property
declare module 'http' {
    interface Server {
        io?: SocketIOServer;
    }
}

const PORT_NAME = 'COM3'; // DMX adapter location
const BAUD_RATE = 250000; // DMX512 baud rate (250 kbps)
const DMX_CHANNELS = 512;
const UPDATE_RATE_HZ = 30; // 30Hz default

const BREAK_DURATION = 176; // Break duration in microseconds
const MAB_DURATION = 12; // Mark after break duration in microseconds
const FRAME_DELAY = 1000 / UPDATE_RATE_HZ; // Time between frames in milliseconds

let dmxData = new Uint8Array(DMX_CHANNELS).fill(0); // Initialize DMX data with zeros
let port: SerialPort | null = null;

// Initialize the serial port
async function initializePort() {
    if (port) return; // Already initialized
    port = new SerialPort({
        path: PORT_NAME,
        baudRate: BAUD_RATE,
        dataBits: 8,
        stopBits: 2,
        parity: 'none',
        autoOpen: false,
    });

    return new Promise((resolve, reject) => {
        port!.open((err) => {
            if (err) {
                console.error('Error opening serial port:', err.message);
                return reject(err);
            }
            console.log('Serial port opened.');
            resolve(true);
        });
    });
}

// Send DMX data in a loop
async function sendDMX() {
    if (!port) await initializePort(); // Ensure port is initialized

    const sendFrame = () => {
        if (!port || !port.isOpen) return; // Exit if the port is not open

        sendBreak(() => {
            sendMarkAfterBreak(() => {
                port!.write(dmxData, (err) => {
                    if (err) {
                        console.error('Error writing DMX data:', err);
                    }
                });

                setTimeout(sendFrame, FRAME_DELAY); // Repeat after a short delay
            });
        });
    };

    sendFrame(); // Start sending frames
}

// Send the DMX break signal
function sendBreak(callback: () => void) {
    if (!port) return;

    port.set({ brk: true }, (err) => {
        if (err) return console.error('Error during break:', err);
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // @ts-ignore
    const server = res.socket?.server as HttpServer | undefined;

    if (!server) {
        res.status(500).send('Server not found');
        return;
    }

    // Check if the Socket.IO server already exists
    if (!server.io) {
        const io = new SocketIOServer(server, {
            path: '/api/socketio', // Custom path for Socket.IO
            cors: {
                origin: '*',
            },
        });        

        // Updated connection handler
        io.on('connection', (socket) => {
            console.log('Socket.IO connection established', socket.id);

            // If you need to access the server, you can use 'io' directly
            // For example, you can broadcast messages to all connected sockets
            // io.emit('someEvent', { message: 'Hello everyone!' });

            socket.on('disconnect', () => {
                console.log('Socket.IO connection closed', socket.id);
            });

            socket.on('dmxUpdate', (data: { dmxValues: number[] }) => {
                if (Array.isArray(data.dmxValues) && data.dmxValues.length === DMX_CHANNELS) {
                    dmxData = new Uint8Array(data.dmxValues); // Update DMX data
                    console.log('DMX data updated:', dmxData); // Log the updated DMX data
                } else {
                    console.warn('Received invalid DMX values:', data.dmxValues);
                }
            });
        });

        console.log('Socket.IO server started');
        server.io = io; // Store the Socket.IO server instance on the HTTP server
    }

    res.end();

    // Start sending DMX if not already running
    await sendDMX();
}
