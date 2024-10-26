'use client';

import React, { useState } from 'react';
import useSocket from '@/hooks/useSocket';
import { toast } from 'react-toastify';
import { Button, ScrollShadow } from '@nextui-org/react';

export default function SimpleDesk() {
    const [dmxValues, setDmxValues] = useState<number[]>(Array(512).fill(0));
    const socket = useSocket();

    // Function to handle slider change for each channel
    const handleSliderChange = async (channel: number, value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value;

        requestAnimationFrame(() => {
            setDmxValues(prevValues => {
                const newValues = [...prevValues];
                newValues[channel] = newValue;  // Adjusted to zero-indexed array
                return newValues;
            });
        });

        // Send the WebSocket event
        if (socket && socket.connected) {
            socket.emit('dmxUpdate', { channel: channel + 1, value: newValue }); // Adjusted to 1-indexed for WebSocket
        } else {
            console.warn('Socket is not connected. Cannot send DMX values.');
            toast("Socket is not connected. Cannot send DMX values.");
        }
    };

    // Handle scroll on each slider to adjust its value
    const handleSliderScroll = (e: React.WheelEvent, index: number) => {
        // e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1; // Scroll up = 1, Scroll down = -1
        const newValue = Math.min(255, Math.max(0, dmxValues[index] + direction)); // Clamp between 0 and 255

        handleSliderChange(index, newValue); // Update the slider and DMX value
    };

    // Function to reset all DMX channels to 0
    const handleResetAll = () => {
        const resetValues = Array(512).fill(0);
        setDmxValues(resetValues); // Reset all sliders to 0

        // Send the WebSocket update for each channel
        if (socket && socket.connected) {
            resetValues.forEach((value, index) => {
                socket.emit('dmxUpdate', { channel: index + 1, value }); // Emit reset for each channel
            });
        } else {
            console.warn('Socket is not connected. Cannot reset DMX values.');
            toast("Socket is not connected. Cannot reset DMX values.");
        }
    };

    // send to
    const sendToFunction = () => {
        console.log("send to function");
    }

    return (
        <div>
            <div className='flex justify-between'>
                <Button
                    onClick={handleResetAll}
                    className='min-w-8 min-h-8 rounded-full mb-4'
                    color='primary'
                    title='Reset All Values'
                >X</Button>
                <Button
                    onClick={sendToFunction}
                    color='primary'
                    title='Send To Function'
                >Send To Function</Button>
            </div>

            <ScrollShadow orientation='horizontal' className="flex overflow-x-scroll min-h-80">
                {dmxValues.map((value, index) => (
                    <div key={index} className="flex flex-col items-center min-h-full max-w-8">
                        <label className='select-none'>{index + 1}</label>
                        <input
                            type="range"
                            min="0"
                            max="255"
                            value={value}
                            onChange={(e) => handleSliderChange(index, +e.target.value)}
                            onWheel={(e) => handleSliderScroll(e, index)} // Handle scroll on the slider
                            className="w-72 h-2 -rotate-90 mt-[140px]"
                        />
                        <span className='mt-[140px] select-none'>{value}</span>
                    </div>
                ))}
            </ScrollShadow>
        </div>
    );
};
