import React, { useState, useEffect } from 'react';
import { io, Socket } from '@/node_modules/socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DMXControl: React.FC = () => {
    const [dmxValues, setDmxValues] = useState<number[]>(Array(512).fill(0));
    const [socket, setSocket] = useState<Socket | null>(null);
    const channelLabels = ['Red Light', 'Green Light', 'Blue Light', 'Strobe']; // Add more labels as needed

    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            path: '/api/socketio', // Match the server path
        });
    
        newSocket.on('connect', () => {
            console.log('Socket.IO connected', newSocket.id);
            setSocket(newSocket);  // Set the socket in the state
            toast("Socket connected!");
        });
    
        newSocket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
            setSocket(null);  // Clear socket on disconnect
            toast("Socket disconnected!");
        });
    
        newSocket.on('connect_error', (err) => {
            console.error('Connection error:', err);
            toast("Socket connection error!");
        });
    
        return () => {
            newSocket.disconnect();  // Clean up on component unmount
        };
    }, []);

    // Function to handle slider change for each channel
    const handleSliderChange = (channel: number, value: number) => {
        const newValues = [...dmxValues];
        newValues[channel] = value;
        setDmxValues(newValues);

        if (socket && socket.connected) {
            socket.emit('dmxUpdate', { dmxValues: newValues });
        } else {
            console.warn('Socket is not connected. Cannot send DMX values.');
            toast("Socket is not connected. Cannot send DMX values.");
        }
    };

    return (
        <div>
            <ToastContainer closeOnClick theme='dark'  autoClose={2400} />
            <h1>DMX Control</h1>
            <div>
                {socket ? (
                    <span style={{ color: 'green' }}>Connected</span>
                ) : (
                    <span style={{ color: 'red' }}>Disconnected</span>
                )}
            </div>
            <div className="slider-container">
                {dmxValues.map((value, index) => (
                    <div key={index} className="slider">
                        <label>{channelLabels[index] || `Channel ${index + 1}`}</label>
                        <input
                            type="range"
                            min="0"
                            max="255"
                            value={value}
                            onChange={(e) => handleSliderChange(index, Number(e.target.value))}
                        />
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .slider-container {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 20px;
                }
                .slider {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                input[type='range'] {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default DMXControl;
