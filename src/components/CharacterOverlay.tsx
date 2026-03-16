"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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

export function CharacterOverlay() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "true";
  const [chars, setChars] = useState<CharItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const [dragState, setDragState] = useState<{ id: number; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  const addChar = useCallback((opt: typeof CHAR_OPTIONS[number]) => {
    const id = nextId;
    setNextId(id + 1);
    const scrollY = window.scrollY;
    setChars(prev => [...prev, {
      id, type: opt.type, src: opt.src,
      x: window.innerWidth / 2 - opt.w / 2,
      y: scrollY + window.innerHeight / 2 - opt.h / 2,
      w: opt.w, h: opt.h, z: 9000 + prev.length, opacity: 100
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
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      updateChar(dragState.id, { x: dragState.origX + dx, y: dragState.origY + dy });
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
      if (e.key === "ArrowLeft") { updateChar(selectedId, { x: (chars.find(c => c.id === selectedId)?.x ?? 0) - step }); e.preventDefault(); }
      if (e.key === "ArrowRight") { updateChar(selectedId, { x: (chars.find(c => c.id === selectedId)?.x ?? 0) + step }); e.preventDefault(); }
      if (e.key === "ArrowUp") { updateChar(selectedId, { y: (chars.find(c => c.id === selectedId)?.y ?? 0) - step }); e.preventDefault(); }
      if (e.key === "ArrowDown") { updateChar(selectedId, { y: (chars.find(c => c.id === selectedId)?.y ?? 0) + step }); e.preventDefault(); }
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
    const sections = document.querySelectorAll("section");
    const output = chars.map(c => {
      let sectionName = "페이지 전체";
      let relY = c.y;
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const secTop = rect.top + window.scrollY;
        const secBottom = secTop + rect.height;
        if (c.y >= secTop && c.y < secBottom) {
          sectionName = sec.className.slice(0, 60);
          relY = c.y - secTop;
        }
      });
      return `{ image: "${c.type}.png", x: ${Math.round(c.x)}, y: ${Math.round(relY)}, w: ${c.w}, h: ${c.h}, z: ${c.z}, opacity: ${c.opacity / 100}, section: "${sectionName}" }`;
    });
    const text = `[\n${output.join(",\n")}\n]`;
    navigator.clipboard.writeText(text).catch(() => {});
    setShowOutput(true);
    setTimeout(() => setShowOutput(false), 5000);
    alert("복사 완료! 이 값을 전달해주세요.\n\n" + text);
  };

  if (!editMode) return null;

  return (
    <>
      {/* Toolbar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999, background: "rgba(20,20,40,0.95)", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", borderBottom: "2px solid #4A86CF", backdropFilter: "blur(10px)" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#4A86CF" }}>🦕 배치 편집</span>
        {CHAR_OPTIONS.map(opt => (
          <button key={opt.type} onClick={() => addChar(opt)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #555", background: "#2a2a4a", color: "#fff", fontSize: "11px", cursor: "pointer" }}>{opt.label}</button>
        ))}
        <span style={{ color: "#666" }}>|</span>
        <button onClick={() => selectedId !== null && updateChar(selectedId, { z: (selectedChar?.z ?? 9000) + 10 })} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #666", background: "#333", color: "#fff", fontSize: "11px", cursor: "pointer" }}>앞으로↑</button>
        <button onClick={() => selectedId !== null && updateChar(selectedId, { z: Math.max(1, (selectedChar?.z ?? 9000) - 10) })} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #666", background: "#333", color: "#fff", fontSize: "11px", cursor: "pointer" }}>뒤로↓</button>
        <span style={{ color: "#666" }}>|</span>
        <span style={{ fontSize: "11px", color: "#aaa" }}>투명도</span>
        <input type="range" min={10} max={100} value={selectedChar?.opacity ?? 100} onChange={e => selectedId !== null && updateChar(selectedId, { opacity: parseInt(e.target.value) })} style={{ width: "70px" }} />
        <span style={{ fontSize: "11px", color: "#aaa" }}>{selectedChar?.opacity ?? 100}%</span>
        <span style={{ color: "#666" }}>|</span>
        <button onClick={deleteSelected} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #c0392b", background: "#c0392b", color: "#fff", fontSize: "11px", cursor: "pointer" }}>삭제</button>
        <button onClick={exportConfig} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #4A86CF", background: "#4A86CF", color: "#fff", fontSize: "11px", cursor: "pointer" }}>📋 코드 복사</button>
        {selectedChar && <span style={{ fontSize: "10px", color: "#888", marginLeft: "8px" }}>{selectedChar.type} | {selectedChar.w}×{selectedChar.h} | x:{Math.round(selectedChar.x)} y:{Math.round(selectedChar.y)}</span>}
      </div>

      {/* Characters */}
      {chars.map(c => (
        <div
          key={c.id}
          onMouseDown={e => { e.preventDefault(); setSelectedId(c.id); setDragState({ id: c.id, startX: e.clientX, startY: e.clientY, origX: c.x, origY: c.y }); }}
          style={{
            position: "absolute", left: c.x, top: c.y, width: c.w, height: c.h,
            zIndex: c.z, opacity: c.opacity / 100, cursor: dragState?.id === c.id ? "grabbing" : "grab",
            outline: selectedId === c.id ? "2px dashed #4A86CF" : "none", outlineOffset: "4px",
            userSelect: "none",
          }}
        >
          <Image src={c.src} alt="" width={c.w} height={c.h} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
        </div>
      ))}
    </>
  );
}
