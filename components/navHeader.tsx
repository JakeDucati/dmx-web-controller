'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";

export default function NavHeader() {
    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
            </NavbarContent>
        </Navbar>
    );
}