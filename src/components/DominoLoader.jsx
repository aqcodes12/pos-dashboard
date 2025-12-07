import React from "react";

const DominoLoader = () => {
  const spans = Array(8).fill(0);

  return (
    <div className="relative w-[60px] h-[60px] flex justify-center items-center">
      {spans.map((_, i) => (
        <span
          key={i}
          className="domino-span"
          style={{
            left: `${80 - i * 10}px`,
            animationDelay: `${0.125 + i * 0.175}s`,
          }}
        ></span>
      ))}
    </div>
  );
};

export default DominoLoader;
