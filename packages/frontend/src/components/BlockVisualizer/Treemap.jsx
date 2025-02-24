import { useMemo } from "react";
import * as d3 from "d3";

const colors = [
  "#f4a261",
  "#2a9d8f",
  "#e76f51",
  "#264653",
  "#8d99ae",
  "#e63946",
  "#6a0572",
  "#457b9d",
];

const Treemap = ({
  width,
  height,
  data,
  handleOnClick,
  rootColor,
  distributionMode,
}) => {
  const hierarchy = useMemo(
    () => d3.hierarchy(data).sum((d) => d.value),
    [data]
  );

  // Définir la couleur du root et les couleurs des enfants
  const colorScale = d3
    .scaleOrdinal()
    .domain(hierarchy.children?.map((c) => c.data.name) || [])
    .range(colors);

  const root = useMemo(
    () => d3.treemap().size([width, height]).padding(6)(hierarchy),
    [hierarchy, width, height]
  );

  return (
    <svg width={width} height={height} className="border rounded-lg shadow-lg">
      {root.leaves().map((leaf, i) => {
        const { name, _id, value, nb_blocks } = leaf.data;
        const fillColor = rootColor || colorScale(name); // Utilise rootColor si fourni

        return (
          <g
            key={i}
            onClick={() => _id && handleOnClick(leaf.data, fillColor)}
            className="cursor-pointer"
          >
            <rect
              x={leaf.x0}
              y={leaf.y0}
              width={leaf.x1 - leaf.x0}
              height={leaf.y1 - leaf.y0}
              stroke="black"
              strokeWidth={2}
              fill={fillColor}
              className="opacity-90 hover:opacity-100 transition-all duration-200"
            />
            {leaf.x1 - leaf.x0 > 60 && leaf.y1 - leaf.y0 > 35 && (
              <>
                <text
                  x={leaf.x0 + 6}
                  y={leaf.y0 + 18}
                  fontSize={14}
                  fill="white"
                  fontWeight="bold"
                >
                  {name}
                </text>
                <text
                  x={leaf.x0 + 6}
                  y={leaf.y0 + 34}
                  fontSize={12}
                  fill="white"
                >
                  {nb_blocks || 0} blocs
                </text>
                <text
                  x={leaf.x0 + 6}
                  y={leaf.y0 + 50}
                  fontSize={12}
                  fill="white"
                >
                  {distributionMode != "volume" && `${value} cm`}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default Treemap;
