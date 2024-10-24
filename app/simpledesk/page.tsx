'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from '@/node_modules/socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slider } from '@nextui-org/react';

const DMXControl: React.FC = () => {
    const [dmxValues, setDmxValues] = useState<number[]>(Array(512).fill(0));
    const [socket, setSocket] = useState<Socket | null>(null);
    // const channelLabels = ['Red Light', 'Green Light', 'Blue Light', 'Strobe'];

    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            path: '/api/socketio', // Match the server path
        });

        newSocket.on('connect', () => {
            console.log('Socket.IO connected', newSocket.id);
            setSocket(newSocket);  // Set the socket in the state
            toast("Socket Connected!");
        });

        newSocket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
            setSocket(null); // Clear socket on disconnect
            toast("Socket Disconnected! Reconnecting...");
        });

        newSocket.on('connect_error', (err) => {
            console.error('Connection error:', err);
            toast("Socket Connection Error | " + err);
        });

        return () => {
            newSocket.disconnect();  // Clean up on component unmount
        };
    }, []);

    // Function to handle slider change for each channel
    const handleSliderChange = (channel: number, value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value;
        const newValues = [...dmxValues];
        newValues[channel] = newValue;
        setDmxValues(newValues);
    
        if (socket && socket.connected) {
            socket.emit('dmxUpdate', { channel, value: newValue });
        } else {
            console.warn('Socket is not connected. Cannot send DMX values.');
            toast("Socket is not connected. Cannot send DMX values.");
        }
    };
    
    return (
        <>
            <ToastContainer closeOnClick theme='dark' autoClose={2400} closeButton={false} />
            <h1>DMX Control</h1>
            <div>
                {socket ? (
                    <span style={{ color: 'green' }}>Connected</span>
                ) : (
                    <span style={{ color: 'red' }}>Disconnected</span>
                )}
            </div>
            <div className="flex overflow-x-scroll min-h-96">
                {dmxValues.map((value = 0, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <label>{index + 1}</label>
                        <Slider
                            size="lg"
                            step={1}
                            maxValue={255}
                            minValue={0}
                            orientation="vertical"
                            aria-label="DMX Value"
                            defaultValue={0}
                            onChange={(newValue) => handleSliderChange(index, newValue)}
                        />
                        <span>{value}</span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DMXControl;
