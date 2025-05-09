"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react"; // Using NextUI for the button

// Define types for blocks
interface Block {
  id: string;
  trackIndex: number;
  startTime: number; // In pixels
  duration: number; // In pixels
  label: string;
}

export default function Timeline() {
  const tracks: null[] = Array(4).fill(null); // 4 tracks
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "block-1",
      trackIndex: 0,
      startTime: 100,
      duration: 150,
      label: "Block 1",
    },
    {
      id: "block-2",
      trackIndex: 1,
      startTime: 200,
      duration: 100,
      label: "Block 2",
    },
  ]);

  // Grid toggle state
  const [isGridVisible, setGridVisible] = useState(false); // Default: Grid hidden

  // Update block position when dropped
  const moveBlock = (
    blockId: string,
    newTrackIndex: number,
    newStartTime: number,
  ) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? { ...block, trackIndex: newTrackIndex, startTime: newStartTime }
          : block,
      ),
    );
  };

  // Handle grid toggle
  const toggleGrid = () => {
    setGridVisible((prev) => !prev);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-200">MIDI Timeline</h1>

      {/* Grid Toggle Button */}
      <Button className="mb-4" color="primary" onClick={toggleGrid}>
        Grid
      </Button>

      <div className="relative border border-gray-700 bg-gray-800 p-4 overflow-auto">
        {isGridVisible && <Grid />}
        {tracks.map((_, trackIndex) => (
          <Track
            key={trackIndex}
            blocks={blocks.filter((block) => block.trackIndex === trackIndex)}
            isGridVisible={isGridVisible}
            moveBlock={moveBlock}
            trackIndex={trackIndex}
          />
        ))}
      </div>
    </div>
  );
}

// Grid Component: Draws vertical lines every 50px
const Grid = () => {
  const gridLines = [];
  const containerWidth = 1250; // You can dynamically calculate this based on the container width

  for (let i = 0; i < containerWidth; i += 50) {
    gridLines.push(
      <div
        key={i}
        className="absolute top-0 bottom-0 border-l border-gray-600 opacity-50"
        style={{ left: `${i}px` }}
      />,
    );
  }

  return <>{gridLines}</>;
};

interface TrackProps {
  trackIndex: number;
  blocks: Block[];
  moveBlock: (
    blockId: string,
    newTrackIndex: number,
    newStartTime: number,
  ) => void;
  isGridVisible: boolean;
}

function Track({ trackIndex, blocks, moveBlock, isGridVisible }: TrackProps) {
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const dropX = event.clientX;
    const timelineOffsetLeft = event.currentTarget.getBoundingClientRect().left; // Get the position of the timeline container
    let dropXRelative = dropX - timelineOffsetLeft; // Get X position relative to the timeline container

    // If grid is visible, snap to the nearest 50px
    if (isGridVisible) {
      dropXRelative = Math.round(dropXRelative / 50) * 50; // Snap to nearest 50px grid point
    }

    // Calculate the new start time based on where the cursor is
    const newStartTime = Math.max(0, dropXRelative); // Now the start time is directly based on the pixel position

    // Get the dragged block ID from the dataTransfer object
    const draggedBlockId = event.dataTransfer.getData("blockId");

    // Call the moveBlock function to update block position
    moveBlock(draggedBlockId, trackIndex, newStartTime);
  };

  return (
    <div
      className="border-b border-gray-700 relative h-16"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {blocks.map((block) => (
        <DraggableBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

interface DraggableBlockProps {
  block: Block;
}

function DraggableBlock({ block }: DraggableBlockProps) {
  const handleDragStart = (event: React.DragEvent) => {
    // Set the block ID in the drag data
    event.dataTransfer.setData("blockId", block.id);
    event.dataTransfer.setData("trackIndex", block.trackIndex.toString());
  };

  return (
    <div
      draggable
      className="h-full relative bg-blue-600 text-white rounded-lg shadow flex"
      style={{
        left: `${block.startTime}px`, // Use the updated startTime in pixels for exact positioning
        width: `${block.duration}px`, // Set width based on block duration in pixels
      }}
      onDragStart={handleDragStart}
    >
      <div className="h-full w-2 left-0 bg-slate-600 rounded-s-md cursor-w-resize" />
      {block.label}
      <div className="h-full w-2 absolute right-0 bg-slate-600 rounded-e-md cursor-w-resize" />
    </div>
  );
}
