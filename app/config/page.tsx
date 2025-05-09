"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Switch,
  Tab,
  Tabs,
} from "@nextui-org/react";

export default function Config() {
  return (
    <Tabs placement="start">
      <Tab key="dmx" className="w-full" title="DMX">
        <Card>
          <CardHeader>DMX Settings</CardHeader>
          <Divider />
          <CardBody>
            <div className="flex justify-between items-center h-14">
              <span>Adapter Location</span>
              <span>
                <Input className="max-h-12" label="Location" type="text" />
              </span>
            </div>
            <div className="flex justify-between items-center h-14">
              <span>Baud Rate</span>
              <span>
                <Input className="max-h-12" label="Baud Rate" type="text" />
              </span>
            </div>
            <div className="flex justify-between items-center h-14">
              <span>Frequency</span>
              <span>
                <Input className="max-h-12" label="Frequency" type="text" />
              </span>
            </div>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="audio" className="w-full" title="Audio">
        <Card>
          <CardHeader>Audio Settings</CardHeader>
          <Divider />
          <CardBody>
            <div className="flex justify-between items-center h-14">
              <span>Output On Server</span>
              <span>
                <Switch />
              </span>
            </div>
            <div className="flex justify-between items-center h-14">
              <span>Output On Client</span>
              <span>
                <Switch />
              </span>
            </div>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="other" className="w-full" title="Other">
        <Card>
          <CardHeader>Other Settings</CardHeader>
          <Divider />
          <CardBody>
            <div className="flex justify-between items-center h-14">
              <span>Something</span>
              <span>
                <Switch />
              </span>
            </div>
            <div className="flex justify-between items-center h-14">
              <span>Something</span>
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
