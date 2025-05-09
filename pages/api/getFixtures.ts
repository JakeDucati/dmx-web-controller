import fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

/**
 * Recursively build a nested structure of directories and files.
 */
function getNestedFixtureStructure(dir: string): Record<string, any> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const structure: Record<string, any> = {};

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively add subdirectory contents
      structure[entry.name] = getNestedFixtureStructure(entryPath);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      // Add file without the .json extension
      const fileName = entry.name.replace(".json", "");

      structure[fileName] = null; // Use null to indicate a file
    }
  }

  return structure;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const baseDirectory = path.join(process.cwd(), "global/fixtures");
    const fixtureStructure = getNestedFixtureStructure(baseDirectory);

    console.log("Fixture Structure:", fixtureStructure); // Add logging
    res.status(200).json(fixtureStructure);
  } catch (error) {
    console.error("Error reading fixtures:", error);
    res.status(500).json({ error: "Failed to read the fixtures directory" });
  }
}
