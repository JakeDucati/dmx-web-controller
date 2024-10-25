'use client';

import useSocket from "@/hooks/useSocket";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function NavHeader() {
    const pathname = usePathname();
    const socket = useSocket();

    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">DMX Web Controller</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    {socket ? (
                        <span className='text-green-600'>Connected</span>
                    ) : (
                        <span className='text-red-600'>Disconnected</span>
                    )}
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/simpledesk">
                        Simple Desk
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/timeline">
                        Timeline
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/config">
                        Config
                    </Link>
                </NavbarItem>
                {/* <Tabs aria-label="Options" selectedKey={pathname}>
                    <Tab key="simpledesk" title="Simple Desk" href="/simpledesk">
                        Simple Desk
                    </Tab>
                    <Tab key="timeline" title="Timeline" href="/timeline">
                        Timeline
                    </Tab>
                    <Tab key="config" title="Config" href="/config">
                        Config
                    </Tab>
                </Tabs> */}
            </NavbarContent>
        </Navbar>
    );
}