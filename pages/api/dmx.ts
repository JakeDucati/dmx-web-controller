import { NextApiRequest, NextApiResponse } from 'next';
import { SerialPort } from 'serialport';

const PORT_NAME = 'COM3'; // DMX adapter location
const BAUD_RATE = 250000; // DMX512 baud rate (250 kbps)
const DMX_CHANNELS = 512;
const UPDATE_RATE_HZ = 30; // 30Hz default

const BREAK_DURATION = 176; // Break duration in microseconds
const MAB_DURATION = 12; // Mark after break duration in microseconds
const FRAME_DELAY = 1000 / UPDATE_RATE_HZ; // Time between frames in milliseconds

const dmxData = new Uint8Array(DMX_CHANNELS).fill(0);
dmxData[0] = 0;   // DMX start code (0x00)
dmxData[1] = 255; // Channel 1 set to 255
dmxData[2] = 255; // Channel 2 set to 255
dmxData[3] = 50;  // Channel 3 set to 255
dmxData[4] = 200; // Channel 4 set to 255

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

// Send DMX data
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

                setTimeout(sendFrame, FRAME_DELAY);
            });
        });
    };

    sendFrame(); // Start sending frames
}

function sendBreak(callback: () => void) {
    if (!port) return;

    port.set({ brk: true }, (err) => {
        if (err) return console.error('Error during break:', err);
        setTimeout(() => {
            port!.set({ brk: false }, callback);
        }, BREAK_DURATION / 1000);
    });
}

function sendMarkAfterBreak(callback: () => void) {
    setTimeout(callback, MAB_DURATION / 1000);
}

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        await sendDMX(); // Start sending DMX data
        res.status(200).json({ message: 'DMX data transmission started.' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
