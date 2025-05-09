"use client";

import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";

export default function FixturesFunctionsLayout() {
  const pathname = usePathname();

  const tabs = [
    { path: "/fixtures-functions", label: "Regular View" },
    { path: "/fixtures-functions/dmx-view", label: "DMX View" },
    { path: "/fixtures-functions/3d-view", label: "3D View" },
  ];

  return (
    <div className="w-full fixed top-[64px] flex items-center justify-center gap-10">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          className={`border-b-2 ${pathname === tab.path ? "border-white" : "border-transparent"}`}
          color="foreground"
          href={tab.path}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
