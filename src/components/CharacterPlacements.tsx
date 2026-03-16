/* eslint-disable @next/next/no-img-element */

const placements = [
  { src: "/images/characters/etc-dino.png", x: 250, y: 15, w: 300, h: 100 },
  { src: "/images/characters/hero-dino.png", x: 885, y: 400, w: 150, h: 180 },
  { src: "/images/characters/group-dino.png", x: 291, y: 329, w: 904, h: 581 },
  { src: "/images/characters/etc-dino.png", x: 530, y: 3032, w: 877, h: 292 },
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
