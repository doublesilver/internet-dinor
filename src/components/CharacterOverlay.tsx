"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface CharItem {
  id: number;
  type: string;
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  opacity: number;
}

interface Placement {
  type: string;
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  opacity: number;
}

const CHAR_OPTIONS = [
  { type: "hero-dino", label: "대표 공룡", src: "/images/characters/hero-dino.png", w: 150, h: 180 },
  { type: "group-dino", label: "단체 공룡", src: "/images/characters/group-dino.png", w: 280, h: 180 },
  { type: "logo-dino", label: "로고", src: "/images/characters/logo-dino.png", w: 220, h: 70 },
  { type: "logo-light", label: "밝은로고", src: "/images/characters/logo-light.png", w: 400, h: 120 },
  { type: "logo-dark", label: "어두운로고", src: "/images/characters/logo-dark.png", w: 400, h: 120 },
  { type: "etc-dino", label: "기타", src: "/images/characters/etc-dino.png", w: 300, h: 100 },
];

// 확정된 배치 설정 — 편집 후 여기에 붙여넣기
const SAVED_PLACEMENTS: Placement[] = [
  { type: "group-dino", src: "/images/characters/group-dino.png", x: 152, y: 312, w: 949, h: 610, z: 50, opacity: 100 },
  { type: "group-dino", src: "/images/characters/group-dino.png", x: 121, y: 1731, w: 612, h: 392, z: 51, opacity: 100 },
  { type: "hero-dino", src: "/images/characters/hero-dino.png", x: 1589, y: 2348, w: 258, h: 307, z: 52, opacity: 100 },
  { type: "etc-dino", src: "/images/characters/etc-dino.png", x: 529, y: 3057, w: 967, h: 322, z: 53, opacity: 100 },
];

function CharImage({ src, x, y, w, h, z, opacity }: { src: string; x: number; y: number; w: number; h: number; z: number; opacity: number }) {
  return (
    <div
      style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z, opacity: opacity / 100, pointerEvents: "none", userSelect: "none" }}
      className="hidden lg:block"
    >
      <img src={src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

export function CharacterOverlay() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "true";
  const [chars, setChars] = useState<CharItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const [dragState, setDragState] = useState<{ id: number; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const addChar = useCallback((opt: typeof CHAR_OPTIONS[number]) => {
    const id = nextId;
    setNextId(id + 1);
    setChars(prev => [...prev, {
      id, type: opt.type, src: opt.src,
      x: window.innerWidth / 2 - opt.w / 2,
      y: window.scrollY + window.innerHeight / 2 - opt.h / 2,
      w: opt.w, h: opt.h, z: 50 + prev.length, opacity: 100
    }]);
    setSelectedId(id);
  }, [nextId]);

  const updateChar = useCallback((id: number, updates: Partial<CharItem>) => {
    setChars(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedId === null) return;
    setChars(prev => prev.filter(c => c.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  useEffect(() => {
    if (!editMode) return;
    const onMove = (e: MouseEvent) => {
      if (!dragState) return;
      updateChar(dragState.id, { x: dragState.origX + (e.clientX - dragState.startX), y: dragState.origY + (e.clientY - dragState.startY) });
    };
    const onUp = () => setDragState(null);
    const onWheel = (e: WheelEvent) => {
      if (selectedId === null) return;
      e.preventDefault();
      const s = e.deltaY > 0 ? 0.95 : 1.05;
      setChars(prev => prev.map(c => c.id !== selectedId ? c : { ...c, w: Math.max(30, Math.round(c.w * s)), h: Math.max(30, Math.round(c.h * s)) }));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") { deleteSelected(); return; }
      if (selectedId === null) return;
      const step = e.shiftKey ? 10 : 1;
      const cur = chars.find(c => c.id === selectedId);
      if (!cur) return;
      if (e.key === "ArrowLeft") { updateChar(selectedId, { x: cur.x - step }); e.preventDefault(); }
      if (e.key === "ArrowRight") { updateChar(selectedId, { x: cur.x + step }); e.preventDefault(); }
      if (e.key === "ArrowUp") { updateChar(selectedId, { y: cur.y - step }); e.preventDefault(); }
      if (e.key === "ArrowDown") { updateChar(selectedId, { y: cur.y + step }); e.preventDefault(); }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); window.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", onKey); };
  }, [editMode, dragState, selectedId, chars, updateChar, deleteSelected]);

  const selected = chars.find(c => c.id === selectedId);

  const exportConfig = () => {
    const out = chars.map(c =>
      `  { type: "${c.type}", src: "${c.src}", x: ${Math.round(c.x)}, y: ${Math.round(c.y)}, w: ${c.w}, h: ${c.h}, z: ${c.z}, opacity: ${c.opacity} }`
    );
    const text = `[\n${out.join(",\n")}\n]`;
    navigator.clipboard.writeText(text).catch(() => {});
    alert("복사 완료!\n\n" + text);
  };

  return (
    <>
      {/* 확정 배치 — 항상 표시 */}
      {SAVED_PLACEMENTS.map((p, i) => (
        <CharImage key={`s${i}`} {...p} />
      ))}

      {/* 편집 모드 */}
      {editMode && (
        <>
          {chars.map(c => (
            <div
              key={`e${c.id}`}
              onMouseDown={e => { e.preventDefault(); setSelectedId(c.id); setDragState({ id: c.id, startX: e.clientX, startY: e.clientY, origX: c.x, origY: c.y }); }}
              style={{
                position: "absolute", left: c.x, top: c.y, width: c.w, height: c.h,
                zIndex: c.z, opacity: c.opacity / 100,
                cursor: dragState?.id === c.id ? "grabbing" : "grab",
                outline: selectedId === c.id ? "2px dashed #4A86CF" : "none",
                outlineOffset: "4px", userSelect: "none",
              }}
              className="hidden lg:block"
            >
              <img src={c.src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
            </div>
          ))}

          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99999, background: "rgba(20,20,40,0.95)", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", borderTop: "2px solid #4A86CF" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#4A86CF" }}>🦕 배치</span>
            {CHAR_OPTIONS.map(o => (
              <button key={o.type} onClick={() => addChar(o)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #555", background: "#2a2a4a", color: "#fff", fontSize: "11px", cursor: "pointer" }}>{o.label}</button>
            ))}
            <span style={{ color: "#666" }}>|</span>
            <button onClick={() => selectedId !== null && updateChar(selectedId, { z: (selected?.z ?? 50) + 10 })} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #666", background: "#333", color: "#fff", fontSize: "11px", cursor: "pointer" }}>앞↑</button>
            <button onClick={() => selectedId !== null && updateChar(selectedId, { z: Math.max(1, (selected?.z ?? 50) - 10) })} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #666", background: "#333", color: "#fff", fontSize: "11px", cursor: "pointer" }}>뒤↓</button>
            <span style={{ color: "#666" }}>|</span>
            <input type="range" min={10} max={100} value={selected?.opacity ?? 100} onChange={e => selectedId !== null && updateChar(selectedId, { opacity: parseInt(e.target.value) })} style={{ width: "60px" }} />
            <span style={{ fontSize: "11px", color: "#aaa" }}>{selected?.opacity ?? 100}%</span>
            <span style={{ color: "#666" }}>|</span>
            <button onClick={deleteSelected} style={{ padding: "4px 8px", borderRadius: "6px", background: "#c0392b", color: "#fff", fontSize: "11px", cursor: "pointer", border: "none" }}>삭제</button>
            <button onClick={exportConfig} style={{ padding: "4px 10px", borderRadius: "6px", background: "#4A86CF", color: "#fff", fontSize: "11px", cursor: "pointer", border: "none" }}>📋 복사</button>
            {selected && <span style={{ fontSize: "10px", color: "#888" }}>{selected.type} {selected.w}×{selected.h} x:{Math.round(selected.x)} y:{Math.round(selected.y)} z:{selected.z}</span>}
          </div>
        </>
      )}
    </>
  );
}
