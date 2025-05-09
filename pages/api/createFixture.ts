import fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Only POST requests are supported." });
  }

  const { brand, name, type, channels } = req.body;

  // Validate required fields
  if (
    !brand ||
    !name ||
    !type ||
    !Array.isArray(channels) ||
    channels.length === 0
  ) {
    return res.status(400).json({
      error: "Missing required fields: brand, name, type, or channels.",
    });
  }

  try {
    // Sanitize and construct file path
    const sanitizedBrand = brand.trim().replace(/[^a-zA-Z0-9-_]/g, "-");
    const sanitizedName = name.trim().replace(/[^a-zA-Z0-9-_]/g, "-");
    const filePath = path.join(
      process.cwd(),
      "global",
      "fixtures",
      sanitizedBrand,
      `${sanitizedName}.json`,
    );

    // Ensure directory exists
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write JSON data to file
    const jsonData = {
      brand,
      name,
      type,
      channels,
    };

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");

    return res
      .status(200)
      .json({ message: "Fixture saved successfully.", filePath });
  } catch (error) {
    console.error("Error saving fixture:", error);

    return res
      .status(500)
      .json({ error: "Failed to save fixture. Please try again." });
  }
}
