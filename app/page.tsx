'use client';

import Sliders from "@/components/sliders";

export default function Home() {
    // const handleStart = async () => {
    //     const response = await fetch('/api/dmx', {
    //         method: 'POST',
    //     });

    //     if (response.ok) {
    //         console.log('DMX transmission started');
    //     } else {
    //         console.error('Error starting DMX transmission');
    //     }
    // };

    return (
        <div>
            <Sliders />
        </div>
    );
}
