import { FunctionComponent } from "react";

const Tile: FunctionComponent = ({ children }) => {
  return (
    <div className="flex h-12 w-12 items-center justify-center border p-2 [border-color:inherit]">
      {children}
    </div>
  );
};

export default Tile;
