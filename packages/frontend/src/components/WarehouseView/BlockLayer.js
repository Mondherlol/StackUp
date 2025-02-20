import { Rect, Image } from "react-konva";

const BlockLayer = ({
  blocks,
  backgroundImage,
  selectedBlock,
  onDragEnd,
  onContextMenu,
}) => {
  return (
    <>
      {backgroundImage && (
        <Image image={backgroundImage} x={0} y={0} width={1200} height={720} />
      )}
      {blocks.map((block) => (
        <Rect
          key={block._id}
          x={block.position.x}
          y={block.position.y}
          width={block.width}
          height={block.height}
          fill={
            block === selectedBlock
              ? "rgba(255, 0, 0, 0.6)"
              : "rgba(0, 123, 255, 0.6)"
          }
          draggable
          onDragEnd={(e) => {
            const newPosition = {
              x: e.target.x(),
              y: e.target.y(),
            };
            onDragEnd(block._id, newPosition);
          }}
          onContextMenu={(e) => onContextMenu(e, block)}
        />
      ))}
    </>
  );
};

export default BlockLayer;
