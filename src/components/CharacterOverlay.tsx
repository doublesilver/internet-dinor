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

const CHAR_OPTIONS = [
  { type: "hero-dino", label: "대표 공룡", src: "/images/characters/hero-dino.png", w: 150, h: 180 },
  { type: "group-dino", label: "단체 공룡", src: "/images/characters/group-dino.png", w: 280, h: 180 },
  { type: "logo-dino", label: "로고", src: "/images/characters/logo-dino.png", w: 220, h: 70 },
  { type: "logo-light", label: "밝은로고", src: "/images/characters/logo-light.png", w: 400, h: 120 },
  { type: "logo-dark", label: "어두운로고", src: "/images/characters/logo-dark.png", w: 400, h: 120 },
  { type: "etc-dino", label: "기타", src: "/images/characters/etc-dino.png", w: 300, h: 100 },
];

// 확정된 배치 설정 — 편집 후 여기에 붙여넣기
const SAVED_PLACEMENTS: Omit<CharItem, "id">[] = [
  // { type: "etc-dino", src: "/images/characters/etc-dino.png", x: 250, y: 15, w: 300, h: 100, z: 50, opacity: 100 },
];

function renderChar(c: { src: string; x: number; y: number; w: number; h: number; z: number; opacity: number }, interactive: boolean, extra?: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...extra}
      style={{
        position: "absolute",
        left: c.x,
        top: c.y,
        width: c.w,
        height: c.h,
        zIndex: c.z,
        opacity: c.opacity / 100,
        pointerEvents: interactive ? "auto" : "none",
        userSelect: "none",
        ...(extra?.style ?? {}),
      }}
      className="hidden lg:block"
    >
      <img
        src={c.src}
        alt=""
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
      />
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;
      updateChar(dragState.id, {
        x: dragState.origX + (e.clientX - dragState.startX),
        y: dragState.origY + (e.clientY - dragState.startY),
      });
    };

    const handleMouseUp = () => setDragState(null);

    const handleWheel = (e: WheelEvent) => {
      if (selectedId === null) return;
      e.preventDefault();
      const scale = e.deltaY > 0 ? 0.95 : 1.05;
      setChars(prev => prev.map(c => {
        if (c.id !== selectedId) return c;
        return { ...c, w: Math.max(30, Math.round(c.w * scale)), h: Math.max(30, Math.round(c.h * scale)) };
      }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editMode, dragState, selectedId, chars, updateChar, deleteSelected]);

  const selectedChar = chars.find(c => c.id === selectedId);

  const exportConfig = () => {
    const output = chars.map(c =>
      `  { type: "${c.type}", src: "${c.src}", x: ${Math.round(c.x)}, y: ${Math.round(c.y)}, w: ${c.w}, h: ${c.h}, z: ${c.z}, opacity: ${c.opacity} }`
    );
    const text = `[\n${output.join(",\n")}\n]`;
    navigator.clipboard.writeText(text).catch(() => {});
    alert("복사 완료! SAVED_PLACEMENTS에 붙여넣으면 그대로 적용됩니다.\n\n" + text);
  };

  return (
    <>
      {/* 확정된 배치 — 항상 표시 (편집/일반 모두) */}
      {SAVED_PLACEMENTS.map((p, i) => renderChar(p, false, { key: `saved-${i}` }))}

      {/* 편집 모드: 드래그 가능한 캐릭터들 */}
      {editMode && (
        <>
          {chars.map(c => renderChar(c, true, {
            key: `edit-${c.id}`,
            onMouseDown: (e) => { e.preventDefault(); setSelectedId(c.id); setDragState({ id: c.id, startX: e.clientX, startY: e.clientY, origX: c.x, origY: c.y }); },
            onClick: (e) => { e.stopPropagation(); setSelectedId(c.id); },
            style: {
              cursor: dragState?.id === c.id ? "grabbing" : "grab",
              outline: selectedId === c.id ? "2px dashed #4A86CF" : "none",
              outlineOffset: "4px",
            },
          }))}

          {/* Toolbar */}
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99999, background: "rgba(20,20,40,0.95)", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", borderTop: "2px solid #4A86CF", backdropFilter: "blur(10px)" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#4A86CF" }}>🦕 배치 편집</span>
            {CHAR_OPTIONS.map(opt => (
              <button key={opt.type} onClick={() => addChar(opt)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #555", background: "#2a2a4a", color: "#fff", fontSize: "11px", cursor: "pointer" }}>{opt.label}</button>
            ))}
            <span style={{ color: "#666" }}>|</span>
            <button onClick={() => selectedId !== null && updateChar(selectedId, { z: (selectedChar?.z ?? 50) + 10 })} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #666", background: "#333", color: "#fff", fontSize: "11px", cursor: "pointer" }}>앞으로↑</button>
            <button onClick={() => selectedId !== null && updateChar(selectedId, { z: Math.max(1, (selectedChar?.z ?? 50) - 10) })} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #666", background: "#333", color: "#fff", fontSize: "11px", cursor: "pointer" }}>뒤로↓</button>
            <span style={{ color: "#666" }}>|</span>
            <span style={{ fontSize: "11px", color: "#aaa" }}>투명도</span>
            <input type="range" min={10} max={100} value={selectedChar?.opacity ?? 100} onChange={e => selectedId !== null && updateChar(selectedId, { opacity: parseInt(e.target.value) })} style={{ width: "70px" }} />
            <span style={{ fontSize: "11px", color: "#aaa" }}>{selectedChar?.opacity ?? 100}%</span>
            <span style={{ color: "#666" }}>|</span>
            <button onClick={deleteSelected} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #c0392b", background: "#c0392b", color: "#fff", fontSize: "11px", cursor: "pointer" }}>삭제</button>
            <button onClick={exportConfig} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #4A86CF", background: "#4A86CF", color: "#fff", fontSize: "11px", cursor: "pointer" }}>📋 코드 복사</button>
            {selectedChar && <span style={{ fontSize: "10px", color: "#888", marginLeft: "8px" }}>{selectedChar.type} | {selectedChar.w}×{selectedChar.h} | x:{Math.round(selectedChar.x)} y:{Math.round(selectedChar.y)} | z:{selectedChar.z}</span>}
          </div>
        </>
      )}
    </>
  );
}
