import { useMemo } from "react";
import * as d3 from "d3";

const colors = [
  "#e0ac2b",
  "#6689c6",
  "#a4c969",
  "#e85252",
  "#9a6fb0",
  "#a53253",
  "#7f7f7f",
];

const Treemap = ({ width, height, data }) => {
  const hierarchy = useMemo(
    () => d3.hierarchy(data).sum((d) => d.value),
    [data]
  );

  const firstLevelGroups = hierarchy?.children?.map((child) => child.data.name);
  const colorScale = d3
    .scaleOrdinal()
    .domain(firstLevelGroups || [])
    .range(colors);

  const root = useMemo(() => {
    return d3.treemap().size([width, height]).padding(4)(hierarchy);
  }, [hierarchy, width, height]);

  return (
    <svg width={width} height={height}>
      {root.leaves().map((leaf, i) => {
        const parentName = leaf.parent?.data.name;
        return (
          <g key={i}>
            <rect
              x={leaf.x0}
              y={leaf.y0}
              width={leaf.x1 - leaf.x0}
              height={leaf.y1 - leaf.y0}
              stroke="black"
              strokeWidth={2}
              fill={colorScale(parentName)}
              className="opacity-80 hover:opacity-100"
            />
            <text
              x={leaf.x0 + 3}
              y={leaf.y0 + 15}
              fontSize={12}
              fill="white"
              fontWeight="bold"
            >
              {leaf.data.name}
            </text>
            <text x={leaf.x0 + 3} y={leaf.y0 + 30} fontSize={12} fill="white">
              {leaf.data.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default Treemap;
