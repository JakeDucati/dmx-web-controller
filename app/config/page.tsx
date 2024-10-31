"use client";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function Config() {
    const pathname = usePathname();

    return (
        <Tabs placement="start" selectedKey={pathname}>
            <Tab key="dmx" title="DMX" href="dmx">
                <Card>
                    <CardBody>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="audio" title="Audio" href="audio">
                <Card>
                    <CardBody>
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="other" title="Other" href="other">
                <Card>
                    <CardBody>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}