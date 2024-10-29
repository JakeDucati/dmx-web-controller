"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";

export default function SideWindow() {
    const [width, setWidth] = useState(300); // Initial width

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
            className="fixed top-0 left-0 h-full flex items-center z-10"
            style={{ width: `${width}px`, transition: "width 0.3s ease" }}
        >
            {/* Sidebar content */}
            <div
                className={`bg-gray-800 h-full text-white flex flex-col ${width === 0 ? "hidden" : ""
                    }`}
                style={{ width: width > 20 ? "100%" : "0" }}
            >

                {/* Search Bar */}
                <div className="p-2">
                    {/* <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-1 rounded bg-gray-700 text-white focus:outline-none"
                    /> */}
                    <Input
                        type="search"
                        label="Search"
                    />
                </div>

                {/* Scrollable list */}
                <div className="flex-grow overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {Array.from({ length: 50 }, (_, i) => (
                            <li
                                key={i}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
                            >
                                Item {i + 1}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Resize handle */}
            <div
                className="w-16 h-full cursor-ew-resize bg-slate-800 flex flex-col items-center pt-2"
                onMouseDown={handleMouseDown}
            >
                <Tooltip
                    placement="right"
                    content="Add Fixture"
                >
                <Button
                    className="rounded-full min-w-4 min-h-4"
                    color="primary"
                >+</Button>
                </Tooltip>
            </div>
        </div>
    );
}
