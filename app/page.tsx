'use client';

export default function Home() {
  const handleStart = async () => {
    const response = await fetch('/api/dmx', {
        method: 'POST',
    });

    if (response.ok) {
        console.log('DMX transmission started');
    } else {
        console.error('Error starting DMX transmission');
    }
};

return (
    <div>
        <h1>DMX Control</h1>
        <button onClick={handleStart}>Start DMX</button>
    </div>
);
}
