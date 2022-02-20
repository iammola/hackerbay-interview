import { FunctionComponent } from "react";

import Tile from "./Tile";

const Board: FunctionComponent<BoardProps> = ({ height, width }) => {
  return (
    <div
      className="grid w-max border border-slate-600"
      style={{
        gridTemplateRows: `repeat(${height}, 1fr)`,
        gridTemplateColumns: `repeat(${width}, 1fr)`,
      }}
    >
      {new Array(width * height).fill(null).map((_, i) => (
        <Tile key={i} />
      ))}
    </div>
  );
};

export default Board;

type BoardProps = {
  width: number;
  height: number;
};
