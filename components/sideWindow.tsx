"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Tooltip } from "@nextui-org/react";
import { Lightbulb, Menu, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


export default function SideWindow() {
    const [width, setWidth] = useState(0);
    const [isExpanding, setIsExpanding] = useState(false);
    const [activeTab, setActiveTab] = useState<"fixtures" | "addFixture" | "something">("fixtures");

    // Handles resizing the sidebar by dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = width + (e.clientX - startX);
            setWidth(newWidth > 0 ? newWidth : 0); // Allow collapse to 0 width
            setIsExpanding(false); // Disable transition during drag
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // Expand sidebar if not expanded
    const expandSidebar = () => {
        if (width > 100) return; // Sidebar is already expanded, do nothing

        setIsExpanding(true); // Enable transition
        setWidth(500);

        // Disable transition after expanding
        setTimeout(() => setIsExpanding(false), 200);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            className={`fixed top-0 left-0 h-full flex items-center z-50 ${isExpanding ? "transition-all" : ""}`}
            style={{ width: `${width}px` }}
        >
            {/* Sidebar content */}
            <div
                className={`bg-gray-800 h-full flex flex-col ${width === 0 ? "hidden" : ""}`}
                style={{ width: width > 20 ? "100%" : "0" }}
            >
                {/* Search Bar */}
                <div className="p-2">
                    <Input
                        type="search"
                        label="Search"
                    />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-grow overflow-y-scroll p-2">
                    {activeTab === "fixtures" && (
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
                    )}
                    {activeTab === "addFixture" && (
                        <div>
                            <h2 className="text-lg font-semibold text-white">Add Fixture</h2>
                            {/* Add fixture form or content here */}
                        </div>
                    )}
                    {activeTab === "something" && (
                        <div>
                            <h2 className="text-lg font-semibold text-white">Something Else</h2>
                            {/* Add 'Something' content here */}
                        </div>
                    )}
                </div>
            </div>

            {/* Resize handle with buttons */}
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
                            onClick={() => {
                                setActiveTab("addFixture");
                                expandSidebar();
                            }}
                        >
                            <Plus />
                        </Button>
                    </Tooltip>

                    <Tooltip
                        placement="right"
                        content="Fixtures"
                        color="primary"
                    >
                        <Button
                            className="rounded-full min-w-4 min-h-4 mb-2"
                            color="primary"
                            onClick={() => {
                                setActiveTab("fixtures");
                                expandSidebar();
                            }}
                        >
                            <Lightbulb />
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
                            onClick={() => {
                                setActiveTab("something");
                                expandSidebar();
                            }}
                        >
                            <Menu />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};