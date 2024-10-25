'use client';

import React, { useState } from 'react';
import useSocket from '@/hooks/useSocket';
import { toast } from 'react-toastify';
import { Button, ScrollShadow } from '@nextui-org/react';

export default function SimpleDesk() {
    const [dmxValues, setDmxValues] = useState<number[]>(Array(512).fill(0));
    const socket = useSocket();  // Using the custom hook here

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
        <div>
            <Button
                onClick={() => {setDmxValues(Array(dmxValues.length).fill(0));}}
                className='min-w-8 min-h-8 rounded-full mb-4'
                color='primary'
                title='Reset All Values'
            >X</Button>

            <ScrollShadow orientation='horizontal' className="flex overflow-x-scroll min-h-80">
                {dmxValues.map((value, index) => (
                    <div key={index} className="flex flex-col items-center min-h-full max-w-8">
                        <label>{index + 1}</label>
                        <input
                            type="range"
                            min="0"
                            max="255"
                            value={value}
                            onChange={(e) => handleSliderChange(index, +e.target.value)}
                            className="w-72 h-2 -rotate-90 mt-[140px]"
                        />
                        <span className='mt-[140px]'>{value}</span>
                    </div>
                ))}
            </ScrollShadow>
        </div>
    );
};
