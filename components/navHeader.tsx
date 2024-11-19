"use client";

import useSocket from "@/hooks/useSocket";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function NavHeader() {
    const socket = useSocket();
    const pathname = usePathname();

    const navLinks = [
        { path: "/fixtures-functions", label: "Fixtures & Functions" },
        { path: "/simpledesk", label: "Simple Desk" },
        { path: "/timeline", label: "Timeline" },
        { path: "/config", label: "Config" },
    ];

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">DMX Web Controller</p>
            </NavbarBrand>
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
