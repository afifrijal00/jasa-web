"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 96; // ukuran tampil (px). Frame asli 64px, jadi 1.5x
const CELL = 64; // ukuran 1 frame di sprite sheet
const SLEEP_AFTER_MS = 6000; // tanpa aksi selama ini -> tidur
const KEY = "wa-cat-pos";

type Mode = "idle" | "thinking" | "sleep";
type Info = { frames: number; cols: number; rows: number };

const SHEETS: Record<Mode, { src: string; ms: number }> = {
  idle: { src: "/brodyku-idle-spritesheet.png", ms: 140 },
  thinking: { src: "/brodyku-thinking-spritesheet.png", ms: 200 },
  sleep: { src: "/brodyku-sleeping-spritesheet.png", ms: 320 },
};

const DEFAULT_IDLE: Info = { frames: 8, cols: 3, rows: 3 };

// Muat sprite sheet dan hitung otomatis jumlah frame yang terisi.
// Kalau file tidak ada, hasilnya null.
function loadInfo(src: string): Promise<Info | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(null);
    img.onload = () => {
      const cols = Math.max(1, Math.floor(img.naturalWidth / CELL));
      const rows = Math.max(1, Math.floor(img.naturalHeight / CELL));
      let frames = cols * rows;
      try {
        const cv = document.createElement("canvas");
        cv.width = img.naturalWidth;
        cv.height = img.naturalHeight;
        const ctx = cv.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0);
        let filled = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const d = ctx.getImageData(c * CELL, r * CELL, CELL, CELL).data;
            for (let i = 3; i < d.length; i += 4) {
              if (d[i] > 0) {
                filled++;
                break;
              }
            }
          }
        }
        if (filled > 0) frames = filled;
      } catch {}
      resolve({ frames, cols, rows });
    };
    img.src = src;
  });
}

type Pos = { x: number; y: number };

const clamp = (x: number, y: number): Pos => ({
  x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - SIZE)),
  y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - SIZE)),
});

export default function CatWhatsApp({ href }: { href: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [infos, setInfos] = useState<Partial<Record<Mode, Info>>>({ idle: DEFAULT_IDLE });
  const [frame, setFrame] = useState(0);
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const last = useRef<Pos | null>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Kursor/jari menyentuh -> thinking
  const engage = () => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    setMode("thinking");
  };
  // Tidak ada aksi -> idle, lalu tidur setelah jeda
  const release = () => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    setMode("idle");
    sleepTimer.current = setTimeout(() => setMode("sleep"), SLEEP_AFTER_MS);
  };

  useEffect(() => {
    release();
    return () => {
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
    };
  }, []);

  // Muat ketiga sprite sheet
  useEffect(() => {
    let alive = true;
    (Object.keys(SHEETS) as Mode[]).forEach(async (m) => {
      const info = await loadInfo(SHEETS[m].src);
      if (alive && info) setInfos((prev) => ({ ...prev, [m]: info }));
    });
    return () => {
      alive = false;
    };
  }, []);

  // Kalau sprite untuk mode itu belum ada, pakai idle
  const shown: Mode = infos[mode] ? mode : "idle";
  const info = infos[shown] ?? DEFAULT_IDLE;

  // Animasi loop
  useEffect(() => {
    setFrame(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % info.frames), SHEETS[shown].ms);
    return () => clearInterval(id);
  }, [shown, info.frames]);

  // Posisi tersimpan + jaga tetap di dalam layar saat resize
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Pos;
        if (typeof p.x === "number" && typeof p.y === "number") setPos(clamp(p.x, p.y));
      }
    } catch {}
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerEnter = () => engage();
  const onPointerLeave = () => {
    if (!drag.current.active) release();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    engage();
    const r = btnRef.current!.getBoundingClientRect();
    drag.current = { active: true, moved: false, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top };
    btnRef.current!.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return; // di bawah 6px dianggap klik
    d.moved = true;
    setDragging(true);
    const p = clamp(d.ox + dx, d.oy + dy);
    last.current = p;
    setPos(p);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setDragging(false);
    if (d.moved && last.current) {
      try {
        localStorage.setItem(KEY, JSON.stringify(last.current));
      } catch {}
    }
    // Mouse: tetap thinking selama kursor masih di atas kucing.
    // Layar sentuh: tidak ada hover, jadi kembali ke idle.
    const stillOver = e.pointerType === "mouse" && btnRef.current?.matches(":hover");
    if (!stillOver) release();
    setTimeout(() => {
      drag.current.moved = false;
    }, 0);
  };

  const onClick = () => {
    if (drag.current.moved) return; // habis digeser, bukan klik
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const col = frame % info.cols;
  const row = Math.floor(frame / info.cols);

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Chat via WhatsApp (bisa digeser)"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={engage}
      onBlur={release}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
      style={{
        width: SIZE,
        height: SIZE,
        touchAction: "none",
        ...(pos ? { left: pos.x, top: pos.y } : {}),
      }}
      className={`group fixed z-50 select-none ${
        pos ? "" : "bottom-20 right-5 md:bottom-6"
      } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {/* Label saat hover */}
      {!dragging && (
        <span className="pointer-events-none absolute -top-9 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border-[3px] border-ink bg-[#25D366] px-3 py-1 font-heading text-[11px] font-bold opacity-0 shadow-brutal-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
  Klik Untuk Chat WhatsApp
</span>
      )}

      <span
        aria-hidden="true"
        className="block size-full"
        style={{
          backgroundImage: `url(${SHEETS[shown].src})`,
          backgroundSize: `${info.cols * SIZE}px ${info.rows * SIZE}px`,
          backgroundPosition: `-${col * SIZE}px -${row * SIZE}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          filter: "drop-shadow(2px 3px 0 rgba(30,27,58,0.35))",
          transform: dragging ? "scale(1.1) rotate(-4deg)" : "none",
          transition: "transform 0.12s",
        }}
      />
    </button>
  );
}