"use client";
import { Card, CardBody, CardHeader, Divider, Input, Switch, Tab, Tabs } from "@nextui-org/react";

export default function Config() {
    return (
        <Tabs placement="start">
            <Tab key="dmx" title="DMX" className="w-full">
                <Card>
                    <CardHeader>
                        DMX Settings
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className="flex justify-between items-center h-14">
                            <span>
                                Adapter Location
                            </span>
                            <span>
                                <Input
                                    type="text"
                                    label="Location"
                                    className="max-h-12"
                                />
                            </span>
                        </div>
                        <div className="flex justify-between items-center h-14">
                            <span>
                                Baud Rate
                            </span>
                            <span>
                                <Input
                                    type="text"
                                    label="Baud Rate"
                                    className="max-h-12"
                                />
                            </span>
                        </div>
                        <div className="flex justify-between items-center h-14">
                            <span>
                                Frequency
                            </span>
                            <span>
                                <Input
                                    type="text"
                                    label="Frequency"
                                    className="max-h-12"
                                />
                            </span>
                        </div>
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="audio" title="Audio" className="w-full">
                <Card>
                    <CardHeader>
                        Audio Settings
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className="flex justify-between items-center h-14">
                            <span>
                                Output On Server
                            </span>
                            <span>
                                <Switch />
                            </span>
                        </div>
                        <div className="flex justify-between items-center h-14">
                            <span>
                                Output On Client
                            </span>
                            <span>
                                <Switch />
                            </span>
                        </div>
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="other" title="Other" className="w-full">
                <Card>
                    <CardHeader>
                        Other Settings
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className="flex justify-between items-center h-14">
                            <span>
                                Something
                            </span>
                            <span>
                                <Switch />
                            </span>
                        </div>
                        <div className="flex justify-between items-center h-14">
                            <span>
                                Something
                            </span>
                            <span>
                                <Switch />
                            </span>
                        </div>
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}