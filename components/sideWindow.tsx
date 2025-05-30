"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Autocomplete,
  AutocompleteItem,
  Code,
  Image,
  Tooltip,
} from "@nextui-org/react";
import { Key } from "@react-types/shared";
import { Lightbulb, PackagePlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SideWindow() {
  const [width, setWidth] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "fixtures" | "addFixture" | "createFixture"
  >("fixtures");
  const [channels, setChannels] = useState<{ number: string; label: string }[]>(
    [],
  );
  const [brandInput, setBrandInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [type, setType] = useState("");
  const [files, setFiles] = useState([]);
  const [fixtures, setFixtures] = useState({});

  const sanitize = (value: string) =>
    value.trim().replace(/[^a-zA-Z0-9-_]/g, "-");
  const brand = brandInput.trim();
  const name = nameInput.trim();
  const path = `global/fixtures/${sanitize(brand)}/${sanitize(name)}.json`;

  const handleAutocompleteChange = (selectedValue: Key | null) => {
    setType(String(selectedValue));
  };

  // save fixture
  const handleSave = async () => {
    if (!brand || !name || !type || channels.length === 0) return;

    // Sanitize channels array
    const sanitizedChannels = channels.map(({ number, label }) => ({
      number: number.trim(),
      label: label.trim(),
    }));

    const fixtureData = {
      brand: brand,
      name: name,
      type: type,
      channels: sanitizedChannels,
    };

    console.log("Sending sanitized fixtureData:", fixtureData);

    try {
      const response = await fetch("/api/createFixture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fixtureData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();

        console.error("Error response:", errorDetails);
        toast(`Failed to save fixture: ${errorDetails.error}`);
      } else {
        toast("Fixture saved successfully!");
      }
    } catch (error) {
      console.error("Error saving fixture:", error);
      toast("An error occurred. Please try again.");
    }
  };

  // sidebar resize
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

  // add/remove channel
  const addChannel = () => {
    const channelNumber = (channels.length + 1).toString();

    setChannels([...channels, { number: channelNumber, label: "" }]);
  };
  const removeChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
  };

  // get fixtures
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch("/api/getFixtures");
        const data = await response.json();

        console.log("Fetched Fixtures:", data); // Debugging line
        setFixtures(data); // Set fixtures state here
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };

    fetchFixtures();
  }, []);

  const Folder = ({ name, contents }: { name: string; contents: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
      <div>
        <div
          style={{
            cursor: "pointer",
            fontWeight: isOpen ? "bold" : "normal",
            marginBottom: "5px",
          }}
          onClick={toggleOpen}
        >
          {name}
        </div>
        {isOpen && (
          <div style={{ marginLeft: "20px" }}>
            {contents &&
              Object.entries(contents).map(([key, value]) =>
                value ? (
                  <Folder key={key} contents={value} name={key} />
                ) : (
                  <div key={key} className="flex justify-between items-center">
                    <div>{key}</div>
                    <Button isIconOnly>
                      <Plus />
                    </Button>
                  </div>
                ),
              )}
          </div>
        )}
      </div>
    );
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
          <Input label="Search" type="search" />
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-scroll p-2">
          {activeTab === "fixtures" && (
            <div>
              <h2 className="text-lg font-semibold text-white">Fixtures</h2>
              <div />
            </div>
          )}
          {activeTab === "addFixture" && (
            <div>
              <h2 className="text-lg font-semibold text-white">Add Fixture</h2>
              <div>
                <ul className="space-y-1">
                  {Object.entries(fixtures).map(([key, value]) => (
                    <Folder key={key} contents={value} name={key} />
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeTab === "createFixture" && (
            <div>
              <h2 className="text-lg font-semibold text-white">
                Create Fixture
              </h2>
              <div className="flex flex-col gap-2 mt-4">
                <h3>Info</h3>
                <Input
                  label="Brand"
                  type="text"
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                />
                <Input
                  label="Name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Autocomplete
                    label="Type"
                    onSelectionChange={(selectedValue) =>
                      handleAutocompleteChange(selectedValue)
                    }
                  >
                    <AutocompleteItem key="stationary">
                      Stationary
                    </AutocompleteItem>
                    <AutocompleteItem key="moving">
                      Moving Head
                    </AutocompleteItem>
                    <AutocompleteItem key="laser">Laser</AutocompleteItem>
                  </Autocomplete>
                  <Image
                    height={80}
                    src="/fixtures/stationary.png"
                    width={80}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <h3>Channels</h3>
                <div className="flex flex-col gap-2">
                  {channels.map((channel, index) => (
                    <div key={index} className="flex gap-1">
                      <Input
                        startContent={channel.number} // Display the channel number
                        type="text"
                        value={channel.label} // Bind to the channel's label
                        onChange={(e) => {
                          const newChannels = [...channels];

                          newChannels[index].label = e.target.value; // Only store the trimmed string
                          setChannels(newChannels);
                        }}
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
                  Fixture will be saved as <Code>{path}</Code>
                </div>
                <Button
                  className="w-full rounded-full mt-4"
                  color="primary"
                  isDisabled={!brand || !name || !type || channels.length === 0}
                  onPress={handleSave}
                >
                  Save
                </Button>
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
          <Tooltip color="primary" content="Add Fixture" placement="right">
            <Button
              isIconOnly
              className="rounded-full"
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

          <Tooltip color="primary" content="Fixtures" placement="right">
            <Button
              isIconOnly
              className="rounded-full"
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
          <Tooltip color="primary" content="Create Fixture" placement="right">
            <Button
              isIconOnly
              className="rounded-full mb-3"
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
}
