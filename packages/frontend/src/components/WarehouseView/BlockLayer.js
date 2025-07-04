import { Fragment } from "react";
import { Layer, Rect, Image, Text, Group } from "react-konva";

const BlockLayer = ({
  blocks,
  backgroundImage,
  selectedBlock,
  setBlocks,
  updateBlockPosition,
  handleContextMenu,
}) => {
  return (
    <Layer>
      {backgroundImage && (
        <Image image={backgroundImage} x={0} y={0} width={1200} height={720} />
      )}
      {blocks.map((block) => {
        const fontSize = Math.min(block.width, block.depth) / 5; // Smaller text

        return (
          <Group
            key={block._id}
            x={block.position.x}
            y={block.position.y}
            draggable
            onDragEnd={(e) => {
              const newBlocks = blocks.map((b) =>
                b._id === block._id
                  ? {
                      ...b,
                      position: {
                        x: e.target.x(),
                        y: e.target.y(),
                      },
                    }
                  : b
              );
              setBlocks(newBlocks);
              updateBlockPosition(block._id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onContextMenu={(e) => handleContextMenu(e, block)}
          >
            <Rect
              width={block.width}
              height={block.depth}
              fill={
                block.isCut
                  ? "rgba(255, 0, 0, 0.3)"
                  : block === selectedBlock
                  ? "rgba(0, 134, 255, 0.8)"
                  : "rgba(0, 123, 255, 0.6)"
              }
              stroke={
                block === selectedBlock
                  ? "yellow"
                  : block.isCut
                  ? "rgba(255, 0, 0, 0.4)"
                  : ""
              }
              strokeWidth={block === selectedBlock ? 4 : block.isCut ? 1 : 0}
            />
            <Text
              width={block.width}
              height={block.depth}
              text={block.name}
              fontSize={fontSize}
              fill="white"
              align="center"
              verticalAlign="middle"
            />
          </Group>
        );
      })}
    </Layer>
  );
};

export default BlockLayer;
