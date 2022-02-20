import { FunctionComponent, useLayoutEffect, useState } from "react";

import Tile from "./Tile";

const Board: FunctionComponent<BoardProps> = ({ height, width }) => {
  const [player, setPlayer] = useState<number>();
  const [enemies, setEnemies] = useState<number[]>([]);

  useLayoutEffect(() => {
    const getRandomPoint = () => Math.floor(Math.random() * height * width);

    let player = getRandomPoint();
    const enemies = new Array((height + width) / 2).fill(0).map(getRandomPoint);

    while (enemies.includes(player)) player = getRandomPoint();

    setPlayer(player);
    setEnemies(enemies);
  }, [height, width]);

  return (
    <div
      className="grid w-max border border-slate-600"
      style={{
        gridTemplateRows: `repeat(${height}, 1fr)`,
        gridTemplateColumns: `repeat(${width}, 1fr)`,
      }}
    >
      {new Array(width * height).fill(null).map((_, i) => (
        <Tile key={i}>
          {player === i && "P"}
          {enemies.includes(i) && "E"}
        </Tile>
      ))}
    </div>
  );
};

export default Board;

type BoardProps = {
  width: number;
  height: number;
};
