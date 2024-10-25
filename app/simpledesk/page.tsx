'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from '@/node_modules/socket.io-client';
import { toast, ToastContainer } from 'react-toastify';

export default function SimpleDesk() {
    const [dmxValues, setDmxValues] = useState<number[]>(Array(512).fill(0));
    const [socket, setSocket] = useState<Socket | null>(null);

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
            toast("Socket Failed To Connect | " + err);
        });

        return () => {
            newSocket.disconnect(); // Clean up on component unmount
        };
    }, []);

    // Function to handle slider change for each channel
    const handleSliderChange = async (channel: number, value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value;

        requestAnimationFrame(() => {
            setDmxValues(prevValues => {
                const newValues = [...prevValues];
                newValues[channel] = newValue;
                return newValues;
            });
        });

        // Send the WebSocket event
        if (socket && socket.connected) {
            socket.emit('dmxUpdate', { channel, value: newValue });
        } else {
            console.warn('Socket is not connected. Cannot send DMX values.');
            toast("Socket is not connected. Cannot send DMX values.");
        }
    };

    return (
        <>
            <h1>DMX Control</h1>
            <div>
                {socket ? (
                    <span className='text-green-600'>Connected</span>
                ) : (
                    <span className='text-red-600'>Disconnected</span>
                )}
            </div>
            <div className="flex overflow-x-scroll min-h-96">
                {dmxValues.map((value, index) => (
                    <div key={index} className="flex flex-col items-center min-h-full -mr-64">
                        <label>{index + 1}</label>
                        <input
                            type="range"
                            min="0"
                            max="255"
                            value={value}
                            onChange={(e) => handleSliderChange(index, +e.target.value)}
                            className="w-72 h-2 transform -rotate-90 mt-[140px]"
                        />
                        <span className='mt-[140px]'>{value}</span>
                    </div>
                ))}
            </div>
        </>
    );
};
