import { FunctionComponent } from "react";

const Tile: FunctionComponent = ({ children }) => {
  return (
    <div className="flex h-16 w-16 items-center justify-center border p-1 [border-color:inherit]">
      {children}
    </div>
  );
};

export default Tile;
