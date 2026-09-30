"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const data = [
  { date: "01 Set", value: 1200 },
  { date: "05 Set", value: 2100 },
  { date: "10 Set", value: 1800 },
  { date: "15 Set", value: 3800 },
  { date: "20 Set", value: 2900 },
  { date: "25 Set", value: 4500 },
  { date: "30 Set", value: 4200 },
];

export default function InteractiveLineGraph() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Motor de física para a linha vertical acompanhar o rato de forma fluida
  const mouseX = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 30 });

  const width = 800;
  const height = 250;
  const paddingY = 40;
  const paddingX = 20;

  const maxValue = Math.max(...data.map((d) => d.value));

  const points = data.map((d, i) => {
    const x = paddingX + (i * (width - paddingX * 2)) / (data.length - 1);
    const y = height - paddingY - (d.value / maxValue) * (height - paddingY * 2);
    return { ...d, x, y };
  });

  const getSmoothPath = () => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const xMid = (p0.x + p1.x) / 2;
      d += ` C ${xMid} ${p0.y}, ${xMid} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    
    // Atualiza a posição exata para a linha vertical
    mouseX.set(clientX);

    const scaleX = width / rect.width;
    const svgMouseX = clientX * scaleX;

    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((p, i) => {
      const diff = Math.abs(p.x - svgMouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });
    setHoveredIndex(closestIdx);
  };

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  // Lógica dinâmica para impedir que o Tooltip corte nas extremidades da tela
  const getTooltipOffset = (x: number) => {
    if (x < 60) return 0;          // Se estiver no primeiro ponto, alinha à esquerda
    if (x > width - 60) return -90; // Se estiver no último ponto, alinha à direita
    return -45;                     // Nos pontos centrais, fica centralizado
  };

  return (
    <div 
      className="relative w-full h-64 select-none cursor-crosshair mt-4"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHoveredIndex(null)}
    >
      {/* Container sem overflow-hidden para permitir que o tooltip ultrapasse o limite sem ser cortado */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {activePoint && (
            <>
              {/* Scrubber (Linha Vertical) que segue exatamente o mouse */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ x: springX }}
                className="absolute top-0 bottom-0 w-px bg-neutral-600/50 z-0 origin-left"
              />

              {/* Tooltip Animado */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: activePoint.x,
                  y: activePoint.y - 48
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute z-20 flex flex-col items-center pointer-events-none"
                style={{ marginLeft: getTooltipOffset(activePoint.x) }}
              >
                <div className="bg-[#202020] border border-neutral-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                  R$ {activePoint.value.toLocaleString('pt-BR')}
                </div>
                {/* Remove o triângulo inferior apenas nas pontas extremas para alinhar perfeitamente */}
                {activePoint.x >= 60 && activePoint.x <= width - 60 && (
                  <div className="w-2 h-2 bg-[#202020] border-b border-r border-neutral-700 rotate-45 -mt-1.5"></div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible relative z-10"
        preserveAspectRatio="none"
      >
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="0"
            y1={paddingY + (i * (height - paddingY * 2)) / 3}
            x2={width}
            y2={paddingY + (i * (height - paddingY * 2)) / 3}
            stroke="#262626"
            strokeWidth="1"
          />
        ))}

        <motion.path
          d={getSmoothPath()}
          fill="transparent"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          className="drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]"
        />

        <AnimatePresence>
          {activePoint && (
            <motion.circle
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                cx: activePoint.x,
                cy: activePoint.y
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              r="5"
              fill="#0a0a0a"
              stroke="#7c3aed"
              strokeWidth="3"
              className="drop-shadow-[0_0_5px_rgba(124,58,237,0.8)]"
            />
          )}
        </AnimatePresence>
      </svg>

      <div className="absolute bottom-0 w-full flex justify-between px-5 text-[10px] text-neutral-500 font-medium">
        {data.map((d, i) => (
          <span key={i}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}