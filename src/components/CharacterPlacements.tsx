/* eslint-disable @next/next/no-img-element */

const placements = [
  { src: "/images/characters/etc-dino.png", x: 216, y: -26, w: 442, h: 147 },
  { src: "/images/characters/group-dino.png", x: 236, y: 180, w: 988, h: 637 },
  { src: "/images/characters/group-dino.png", x: 46, y: 1230, w: 612, h: 392 },
  { src: "/images/characters/hero-dino.png", x: 1547, y: 1770, w: 314, h: 373 },
  { src: "/images/characters/etc-dino.png", x: 543, y: 3035, w: 914, h: 305 },
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
