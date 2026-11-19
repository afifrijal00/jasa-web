"use client";

import { useEffect, useState } from "react";

const HOLD_MS = 2400; // lama kepala kucing tampil sebelum mulai keluar
const FADE_MS = 1000; // lama animasi keluar
const ONCE_PER_SESSION = false; // true = hanya tampil sekali per sesi browser
const KEY = "welcome-seen";

// Sprite idle: 8 frame, grid 3 kolom, tiap frame 64px, sheet 192px
const SHEET = "/brodyku-idle-spritesheet.png";
const SHEET_PX = 192;
const FRAMES = 8;
const COLS = 3;
const CELL = 64;
// Area kepala di dalam frame (x, y, lebar, tinggi)
const CX = 8;
const CY = 3;
const CW = 48;
const CH = 32;

const HEAD_W = "min(90vw, 112vh)"; // lebar kepala di layar

type Phase = "in" | "out" | "done";

export default function WelcomeSplash() {
  const [phase, setPhase] = useState<Phase>("in");
  const [frame, setFrame] = useState(0);

  // Putuskan tampil atau tidak
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    if (ONCE_PER_SESSION) {
      try {
        seen = sessionStorage.getItem(KEY) === "1";
        sessionStorage.setItem(KEY, "1");
      } catch {}
    }
    if (reduce || seen) setPhase("done");
  }, []);

  // Jadwal: tampil -> keluar -> selesai
  useEffect(() => {
    if (phase === "done") return;
    const id = setTimeout(
      () => setPhase(phase === "in" ? "out" : "done"),
      phase === "in" ? HOLD_MS : FADE_MS
    );
    return () => clearTimeout(id);
  }, [phase]);

  // Kunci scroll selama splash tampil
  useEffect(() => {
    if (phase === "done") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // Animasi frame kucing
  useEffect(() => {
    if (phase === "done") return;
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES), 140);
    return () => clearInterval(id);
  }, [phase]);

  if (phase === "done") return null;

  const col = frame % COLS;
  const row = Math.floor(frame / COLS);
  const out = phase === "out";

  return (
    <>
      <noscript>
        <style>{`.welcome-overlay{display:none!important}`}</style>
      </noscript>

      <div
        className="welcome-overlay fixed inset-0 z-[100] grid place-items-center overflow-hidden"
        onClick={() => setPhase("out")}
        style={{ pointerEvents: out ? "none" : "auto" }}
      >
        {/* Latar cream transparan */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(255, 243, 214, 0.82)",
            backgroundImage: "radial-gradient(rgba(30,27,58,0.12) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            opacity: out ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        />

        {/* Kepala kucing */}
        <div
          className="relative"
          style={
            {
              "--w": HEAD_W,
              width: "var(--w)",
              transform: out ? "scale(1.06)" : "scale(1)",
              opacity: out ? 0 : 1,
              transition: `transform ${FADE_MS}ms ease, opacity ${Math.round(FADE_MS * 0.7)}ms ease`,
            } as React.CSSProperties
          }
        >
          <div
            className="welcome-pop"
            aria-hidden="true"
            style={{
              width: "var(--w)",
              height: `calc(var(--w) * ${CH} / ${CW})`,
              backgroundImage: `url(${SHEET})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `calc(var(--w) * ${SHEET_PX / CW}) calc(var(--w) * ${SHEET_PX / CW})`,
              backgroundPosition: `calc(var(--w) * ${-(col * CELL + CX) / CW}) calc(var(--w) * ${-(row * CELL + CY) / CW})`,
              imageRendering: "pixelated",
              filter: "drop-shadow(0 1.2vmin 0 rgba(30,27,58,0.22))",
            }}
          />
        </div>

        {/* Caption bawah */}
        <div
          className="pointer-events-none absolute bottom-6 flex flex-col items-center gap-2 md:bottom-9"
          style={{ opacity: out ? 0 : 1, transition: "opacity 0.35s ease" }}
        >
          <div className="welcome-fade flex items-center gap-3 font-display text-[10px] font-bold tracking-[0.3em] text-ink/80 md:text-xs">
            <span className="h-px w-8 bg-ink/40" />
            <span>JASA KODING & WEB DEV</span>
            <span className="h-px w-8 bg-ink/40" />
          </div>
          <p className="text-[10px] font-medium text-ink/50 md:text-[11px]">Klik di mana saja untuk lanjut</p>
        </div>
      </div>
    </>
  );
}