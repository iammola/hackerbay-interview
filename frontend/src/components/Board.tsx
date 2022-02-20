import {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import Tile from "./Tile";
import { Enemy, Player } from "./Images";

const Board: FunctionComponent<BoardProps> = ({ height, width }) => {
  const [moves, setMoves] = useState(0);
  const [player, setPlayer] = useState<number>();
  const [enemies, setEnemies] = useState<number[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (player === undefined) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
        e.preventDefault();

      let nextPosition = player;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        const newX = player % width;
        nextPosition = player + (e.key === "ArrowLeft" ? -1 : 1);

        if (e.key === "ArrowLeft" && newX === 0) return;
        if (e.key === "ArrowRight" && newX === width - 1) return;
      }

      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        nextPosition = player + height * (e.key === "ArrowUp" ? -1 : 1);
        if (nextPosition < 0 || nextPosition > height * width) return;
      }

      setPlayer(nextPosition);
      setMoves((moves) => moves + 1);
      if (enemies.includes(nextPosition))
        setEnemies(enemies.filter((e) => e !== nextPosition));
    },
    [enemies, height, player, width]
  );

  useLayoutEffect(() => {
    const getRandomPoint = () => Math.floor(Math.random() * height * width);

    let player = getRandomPoint();
    const enemies = new Array((height + width) / 2).fill(0).map(getRandomPoint);

    while (enemies.includes(player)) player = getRandomPoint();

    setPlayer(player);
    setEnemies(enemies);
  }, [height, width]);

  useEffect(() => {
    if (enemies.length > 0) window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enemies, handleKeyDown]);

  useEffect(() => {
    if (enemies.length === 0 && moves > 0)
      alert(`Game over. Total moves to save princess: ${moves}`);
  }, [enemies, moves]);

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
          {player === i && <Player className="h-full w-full" />}
          {enemies.includes(i) && <Enemy className="h-full w-full" />}
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
