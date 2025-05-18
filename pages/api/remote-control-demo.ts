import type { NextApiRequest, NextApiResponse } from "next";
import { dmxData } from "./socketio";

const allowCors = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // 🔁 You can change '*' to specific origin if needed
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return handler(req, res);
};


const PAN_STEP = 10;
const TILT_STEP = 10;

const DMX_FIXTURES = {
  movingHead: {
    baseChannel: 74,
    channels: {
      pan: 0,
      tilt: 2,
      dimmer: 7,
      colorWheel: 4,
      goboWheel: 5,
    },
    position: {
      pan: 0,
      tilt: 0,
    },
  },
  par: {
    baseChannel: 66,
    channels: {
      dimmer: 0,
      red: 1,
      green: 2,
      blue: 3,
      speed: 4,
      effect: 5,
    },
  },
};

export default allowCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { light, action } = req.body;

  if (typeof light !== "number" || typeof action !== "number") {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  // === MOVING HEAD ===
  if (light === 0) {
    const fixture = DMX_FIXTURES.movingHead;
    const base = fixture.baseChannel;

    switch (action) {
      case 0: // home
        fixture.position.pan = 0;
        fixture.position.tilt = 0;
        break;
      case 1: // Up → actually move tilt DOWN
        fixture.position.tilt = Math.min(fixture.position.tilt + TILT_STEP, 255);
        break;
      case 2: // Left → actually move pan RIGHT
        fixture.position.pan = Math.min(fixture.position.pan + PAN_STEP, 255);
        break;
      case 3: // Right → actually move pan LEFT
        fixture.position.pan = Math.max(fixture.position.pan - PAN_STEP, 0);
        break;
      case 4: // Down → actually move tilt UP
        fixture.position.tilt = Math.max(fixture.position.tilt - TILT_STEP, 0);
        break;
      case 5: // Off
        dmxData[base + fixture.channels.dimmer] = 0;
        dmxData[base + fixture.channels.goboWheel] = 0;
        dmxData[base + fixture.channels.colorWheel] = 0;
        return res.status(200).json({ status: "OK" }); // ⬅ Optional early return
      case 6: // White
        dmxData[base + fixture.channels.colorWheel] = 0;
        dmxData[base + fixture.channels.dimmer] = 255;
        break;
      case 7: // Red
        dmxData[base + fixture.channels.colorWheel] = 20;
        dmxData[base + fixture.channels.dimmer] = 255;
        break;
      case 8: // Green
        dmxData[base + fixture.channels.colorWheel] = 40;
        dmxData[base + fixture.channels.dimmer] = 255;
        break;
      case 9: // Purple
        dmxData[base + fixture.channels.colorWheel] = 60;
        dmxData[base + fixture.channels.dimmer] = 255;
        break;
      case 10: // Orange
        dmxData[base + fixture.channels.colorWheel] = 36;
        dmxData[base + fixture.channels.dimmer] = 255;
        break;
      case 11: // gobo circle
        dmxData[base + fixture.channels.goboWheel] = 10;
        break;
      case 12: // gobo dots
        dmxData[base + fixture.channels.goboWheel] = 16;
        break;
      case 13: // gobo small dots
        dmxData[base + fixture.channels.goboWheel] = 24;
        break;
      case 14: // gobo lines
        dmxData[base + fixture.channels.goboWheel] = 32;
        break;
      case 15: // gobo bubbles
        dmxData[base + fixture.channels.goboWheel] = 40;
        break;
      case 16: // gobo spiral
        dmxData[base + fixture.channels.goboWheel] = 48;
        break;
      case 17: // gobo waves
        dmxData[base + fixture.channels.goboWheel] = 56;
        break;
      case 18: // gobo auto
        dmxData[base + fixture.channels.goboWheel] = 226;
        break;
      case 19: // gobo off
        dmxData[base + fixture.channels.goboWheel] = 0;
        break;
    }

    // Only update position (not dimmer!)
    dmxData[base + fixture.channels.pan] = fixture.position.pan;
    dmxData[base + fixture.channels.tilt] = fixture.position.tilt;
  }

  // === PAR FIXTURE ===
  if (light === 1) {
    const fixture = DMX_FIXTURES.par;
    const base = fixture.baseChannel;

    // Reset RGB and effect channels first
    dmxData[base + fixture.channels.red] = 0;
    dmxData[base + fixture.channels.green] = 0;
    dmxData[base + fixture.channels.blue] = 0;
    dmxData[base + fixture.channels.effect] = 0;

    switch (action) {
      case 0: // Off
        dmxData[base + fixture.channels.dimmer] = 0;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 1: // White
        dmxData[base + fixture.channels.dimmer] = 255;
        dmxData[base + fixture.channels.red] = 255;
        dmxData[base + fixture.channels.green] = 255;
        dmxData[base + fixture.channels.blue] = 255;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 2: // Red
        dmxData[base + fixture.channels.dimmer] = 255;
        dmxData[base + fixture.channels.red] = 255;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 3: // Green
        dmxData[base + fixture.channels.dimmer] = 255;
        dmxData[base + fixture.channels.green] = 255;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 4: // Purple
        dmxData[base + fixture.channels.dimmer] = 255;
        dmxData[base + fixture.channels.red] = 128;
        dmxData[base + fixture.channels.blue] = 128;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 5: // Orange
        dmxData[base + fixture.channels.dimmer] = 255;
        dmxData[base + fixture.channels.red] = 255;
        dmxData[base + fixture.channels.green] = 165;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 6: // Pink
        dmxData[base + fixture.channels.dimmer] = 255;
        dmxData[base + fixture.channels.red] = 255;
        dmxData[base + fixture.channels.green] = 105;
        dmxData[base + fixture.channels.blue] = 180;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 7: // Blue
        dmxData[base + fixture.channels.dimmer] = 255;
        dmxData[base + fixture.channels.blue] = 255;
        dmxData[base + fixture.channels.speed] = 0;
        break;
      case 8: // Rainbow (trigger effect channel)
        dmxData[base + fixture.channels.effect] = 108;
        dmxData[base + fixture.channels.speed] = 213;
        break;
      default:
        break;
    }
  }

  res.status(200).json({ status: "OK" });
});
