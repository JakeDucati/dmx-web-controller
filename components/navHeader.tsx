"use client";

import useSocket from "@/hooks/useSocket";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, ButtonGroup, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavHeader() {
    const socket = useSocket();
    const pathname = usePathname();

    const navLinks = [
        { path: "/fixtures-functions", label: "Fixtures & Functions" },
        { path: "/simpledesk", label: "Simple Desk" },
        { path: "/timeline", label: "Timeline" },
        { path: "/config", label: "Config" },
    ];

    const [selectedOption, setSelectedOption] = React.useState(new Set(["Save"]));
    const selectedOptionValue = Array.from(selectedOption)[0];

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">Prism Light Controller</p>
            </NavbarBrand>
            <NavbarItem>
                <ButtonGroup variant="flat">
                    <Button>{selectedOptionValue}</Button>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button isIconOnly>
                                <ChevronDown />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Merge options"
                            selectedKeys={selectedOption}
                            selectionMode="single"
                            onSelectionChange={() => {setSelectedOption}}
                            className="max-w-[300px]"
                        >
                            <DropdownItem key="save" description="Does something">
                                Save
                            </DropdownItem>
                            <DropdownItem key="open" description="does something">
                                Open
                            </DropdownItem>
                            <DropdownItem key="orher" description="this">
                                Other
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </ButtonGroup>
            </NavbarItem>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    {socket ? (
                        <span className="text-green-600">Connected</span>
                    ) : (
                        <span className="text-red-600">Disconnected</span>
                    )}
                </NavbarItem>
                {navLinks.map((link) => (
                    <NavbarItem key={link.path}>
                        <Link
                            color="foreground"
                            href={link.path}
                            className={`border-b-2 ${pathname?.startsWith(link.path) ? "border-white" : "border-transparent"}`}
                        >
                            {link.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
        </Navbar>
    );
}
