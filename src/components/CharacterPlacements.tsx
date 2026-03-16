/* eslint-disable @next/next/no-img-element */

const placements: Array<{ src: string; x: number; y: number; w: number; h: number }> = [];

export function CharacterPlacements() {
  return (
    <>
      {placements.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.w,
            height: p.h,
            pointerEvents: "none",
            zIndex: 1,
          }}
          className="hidden lg:block"
          draggable={false}
        />
      ))}
    </>
  );
}
