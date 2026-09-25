"use client";

import { useEffect, useRef } from "react";

export default function GhostFibers({
  fiberCount = 45,
  palette = ["#D5B893", "#617891", "#632024", "#6F4D38"],
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Initialize fibers
    const fibers = Array.from({ length: fiberCount }, (_, i) => ({
      baseY: (height / fiberCount) * i,
      speed: 0.002 + Math.random() * 0.003,
      amplitude: 50 + Math.random() * 90,
      frequency: 0.003 + Math.random() * 0.003,
      phase: Math.random() * Math.PI * 2,
      color: palette[i % palette.length],
      thickness: 0.8 + Math.random() * 1.5,
      alpha: 0.25 + Math.random() * 0.45,
    }));

    let time = 0;

    const render = () => {
      time += 1;
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Ghostly glow blending
      ctx.globalCompositeOperation = "screen";

      fibers.forEach((fiber) => {
        ctx.beginPath();
        ctx.strokeStyle = fiber.color;
        ctx.globalAlpha = fiber.alpha;
        ctx.lineWidth = fiber.thickness;

        const pointsCount = 30;
        const stepX = width / pointsCount;

        for (let i = 0; i <= pointsCount; i++) {
          const x = i * stepX;

          // Wave math
          const wave1 =
            Math.sin(x * fiber.frequency + time * fiber.speed + fiber.phase) *
            fiber.amplitude;
          const wave2 =
            Math.cos(x * fiber.frequency * 0.5 - time * fiber.speed * 0.8) *
            (fiber.amplitude * 0.4);

          // Interaction towards cursor
          const dx = x - mouse.x;
          const dy = fiber.baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 380);
          const mouseDisplacement = (mouse.y - fiber.baseY) * influence * 0.4;

          const y = fiber.baseY + wave1 + wave2 + mouseDisplacement;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [fiberCount, palette]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}