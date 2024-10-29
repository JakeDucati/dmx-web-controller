"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";


export default function SideWindow() {
    const [width, setWidth] = useState(0); // Initial width

    // Handles resizing the sidebar by dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = width + (e.clientX - startX);
            setWidth(newWidth > 0 ? newWidth : 0); // Allow collapse to 0 width
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div
            className="fixed top-0 left-0 h-full flex items-center z-50"
            style={{ width: `${width}px` }}
        >
            {/* Sidebar content */}
            <div
                className={`bg-gray-800 h-full text-white flex flex-col ${width === 0 ? "hidden" : ""}`}
                style={{ width: width > 20 ? "100%" : "0" }}
            >

                {/* Search Bar */}
                <div className="p-2">
                    <Input
                        type="search"
                        label="Search"
                    />
                </div>

                {/* Scrollable list */}
                <div className="flex-grow overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {Array.from({ length: 50 }, (_, i) => (
                            <Button
                                key={i}
                                className="p-2 w-full"
                            >
                                Fixture {i + 1}
                            </Button>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Resize handle */}
            <div
                className="w-16 h-full cursor-ew-resize bg-slate-800 flex flex-col justify-between pt-4"
                onMouseDown={handleMouseDown}
            >
                <div className="flex flex-col items-center">
                    <Tooltip
                        placement="right"
                        content="Add Fixture"
                        color="primary"
                    >
                        <Button
                            className="rounded-full min-w-4 min-h-4 mb-2"
                            color="primary"
                        >+</Button>
                    </Tooltip>

                    <Tooltip
                        placement="right"
                        content="Fixtures"
                        color="primary"
                    >
                        <Button
                            className="rounded-full min-w-4 min-h-4 mb-2"
                            color="primary"
                        >
                            <Image
                                src={"/icons/bulb.svg"}
                                width={20}
                                height={20}
                                alt="Fixtures"
                                className="min-w-[20px] min-h-[20px]"
                            />
                        </Button>
                    </Tooltip>
                </div>
                <div className="flex flex-col items-center">
                    <Tooltip
                        placement="right"
                        content="Something"
                        color="primary"
                    >
                        <Button
                            className="rounded-full min-w-4 min-h-4 mb-2"
                            color="primary"
                        >=</Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
