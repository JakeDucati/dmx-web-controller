"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Autocomplete, AutocompleteItem, Code, Image, Tooltip } from "@nextui-org/react";
import { Lightbulb, PackagePlus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";


export default function SideWindow() {
    const [width, setWidth] = useState(0);
    const [isExpanding, setIsExpanding] = useState(false);
    const [activeTab, setActiveTab] = useState<"fixtures" | "addFixture" | "createFixture">("fixtures");
    const [channels, setChannels] = useState<string[]>([]);

    // Handles resizing the sidebar by dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = width + (e.clientX - startX);
            setWidth(newWidth > 0 ? newWidth : 0);
            setIsExpanding(false);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // expand / retract sidebar
    const toggleSidebar = () => {
        if (width > 100) {
            setIsExpanding(true);
            setWidth(0);
            setTimeout(() => setIsExpanding(false), 200);
        } else {
            setIsExpanding(true);
            setWidth(500);
            setTimeout(() => setIsExpanding(false), 200);
        }
    };

    const addChannel = () => {
        const newChannelNumber = channels.length + 1;
        setChannels([...channels, newChannelNumber.toString()]);
    };
    const removeChannel = (index: number) => {
        setChannels(channels.filter((_, i) => i !== index));
    };



    return (
        <div
            className={`fixed top-0 left-0 h-full flex items-center z-50 ${isExpanding ? "transition-all" : ""}`}
            style={{ width: `${width}px` }}
        >
            <div
                className={`bg-zinc-900 h-full flex flex-col ${width === 0 ? "hidden" : ""}`}
                style={{ width: width > 20 ? "100%" : "0" }}
            >
                {/* Search Bar */}
                <div className="p-2">
                    <Input
                        type="search"
                        label="Search"
                    />
                </div>

                {/* Content Area */}
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
                            <div>

                            </div>
                        </div>
                    )}
                    {activeTab === "createFixture" && (
                        <div>
                            <h2 className="text-lg font-semibold text-white">Create Fixture</h2>
                            <div className="flex flex-col gap-2 mt-4">
                                <h3>Info</h3>
                                <Input
                                    label="Brand"
                                    type="text"
                                    onChange={}
                                />
                                <Input
                                    label="Name"
                                    type="text"
                                />
                                <div className="flex gap-2">
                                    <Autocomplete label="Type">
                                        <AutocompleteItem key="stationary">Stationary</AutocompleteItem>
                                        <AutocompleteItem key="moving">Moving Head</AutocompleteItem>
                                        <AutocompleteItem key="Laser">Laser</AutocompleteItem>
                                    </Autocomplete>
                                    <Image src="/fixtures/stationary.png" width={80} height={80} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <h3>Channels</h3>
                                <div className="flex flex-col gap-2">
                                    {channels.map((channel, index) => (
                                        <div className="flex gap-1" key={index}>
                                            <Input
                                                type="text"
                                                startContent={index + 1}
                                            />
                                            <Button isIconOnly onPress={() => removeChannel(index)}>
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button className="rounded-full" onPress={addChannel}>
                                    <Plus />
                                </Button>
                            </div>

                            <div className="mt-4">
                                <div>
                                    Fixture will be saved as
                                    <Code></Code>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Resize handle */}
            <div
                className="min-w-16 h-full cursor-ew-resize bg-zinc-800 flex flex-col justify-between pt-4"
                onMouseDown={handleMouseDown}
            >
                <div className="flex flex-col items-center gap-2">
                    <Tooltip
                        placement="right"
                        content="Add Fixture"
                        color="primary"
                    >
                        <Button
                            className="rounded-full"
                            isIconOnly
                            color="primary"
                            onPress={() => {
                                setActiveTab("addFixture");
                                if (width < 20) {
                                    toggleSidebar();
                                }
                                if (activeTab === "addFixture") {
                                    toggleSidebar();
                                }
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
                            className="rounded-full"
                            isIconOnly
                            color="primary"
                            onPress={() => {
                                setActiveTab("fixtures");
                                if (width < 20) {
                                    toggleSidebar();
                                }
                                if (activeTab === "fixtures") {
                                    toggleSidebar();
                                }
                            }}
                        >
                            <Lightbulb />
                        </Button>
                    </Tooltip>
                </div>
                <div className="flex flex-col items-center">
                    <Tooltip
                        placement="right"
                        content="Create Fixture"
                        color="primary"
                    >
                        <Button
                            className="rounded-full mb-2"
                            isIconOnly
                            color="primary"
                            onPress={() => {
                                setActiveTab("createFixture");
                                if (width < 20) {
                                    toggleSidebar();
                                }
                                if (activeTab === "createFixture") {
                                    toggleSidebar();
                                }
                            }}
                        >
                            <PackagePlus />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};