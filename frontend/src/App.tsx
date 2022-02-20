import { FunctionComponent, useEffect, useState } from "react";

import Board from "./components/Board";

const App: FunctionComponent = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!size.width)
      setSize((size) => ({
        ...size,
        width: +(prompt("Please enter board width", "10") ?? 0),
      }));
    if (!size.height)
      setSize((size) => ({
        ...size,
        height: +(prompt("Please enter board height", "10") ?? 0),
      }));
  }, [size]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Board {...size} />
    </div>
  );
};

export default App;
