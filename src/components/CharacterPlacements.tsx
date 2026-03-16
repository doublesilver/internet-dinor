/* eslint-disable @next/next/no-img-element */

const placements = [
  { src: "/images/characters/etc-dino.png", x: 177, y: -32, w: 538, h: 180 },
  { src: "/images/characters/hero-dino.png", x: 667, y: 530, w: 150, h: 180 },
];

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
