import React, { useEffect, useRef } from 'react';

export default function SudarshanChakraCanvas({ speed = 1, opacity = 0.85, showChakra = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 160 Swirling Cosmic Golden & Blue Celestial Stars
    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -Math.random() * 0.7 - 0.2,
      opacity: Math.random() * 0.85 + 0.15,
      pulseSpeed: Math.random() * 0.05 + 0.02,
      color: Math.random() > 0.35 ? '#F59E0B' : Math.random() > 0.5 ? '#FEF08A' : '#60A5FA',
    }));

    let rotation = 0;
    let pulse = 0;
    let shockwaveRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth 3D mouse parallax inertia
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const offsetX = (mouseX - width / 2) * 0.05;
      const offsetY = (mouseY - height / 2) * 0.05;

      const centerX = width / 2 + offsetX;
      const centerY = height / 2 + offsetY;

      // Deep space sunset cosmic backdrop gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 40, width / 2, height / 2, width * 0.95);
      bgGrad.addColorStop(0, 'rgba(50, 22, 5, 0.6)');
      bgGrad.addColorStop(0.35, 'rgba(15, 20, 42, 0.9)');
      bgGrad.addColorStop(0.7, 'rgba(8, 12, 28, 0.97)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Twinkling Floating Celestial Stars
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.015;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      // Render High-Level 3D Divine Sudarshan Chakra
      if (showChakra) {
        ctx.save();
        const baseRadius = Math.min(width, height) * 0.26;

        rotation += 0.008 * speed;
        pulse += 0.035;
        shockwaveRadius += 2.5;
        if (shockwaveRadius > baseRadius * 2.2) {
          shockwaveRadius = baseRadius * 0.4;
        }

        const currentRadius = baseRadius + Math.sin(pulse) * 10;

        ctx.translate(centerX, centerY);

        // 1. Expanding Golden Supernova Shockwave Pulse
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, shockwaveRadius, 0, Math.PI * 2);
        const waveOpacity = Math.max(0, 1 - shockwaveRadius / (baseRadius * 2.2));
        ctx.strokeStyle = `rgba(245, 158, 11, ${waveOpacity * 0.65})`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#F59E0B';
        ctx.stroke();
        ctx.restore();

        // 2. 360-Degree Sunburst Radial Light Flares
        const rays = 36;
        ctx.save();
        ctx.rotate(rotation * 0.25);
        for (let i = 0; i < rays; i++) {
          const angle = (i * Math.PI * 2) / rays;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * (currentRadius * 2.1), Math.sin(angle) * (currentRadius * 2.1));
          const rayGrad = ctx.createLinearGradient(0, 0, Math.cos(angle) * (currentRadius * 2.1), Math.sin(angle) * (currentRadius * 2.1));
          rayGrad.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
          rayGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = 14;
          ctx.stroke();
        }
        ctx.restore();

        // 3. Supernova Sun Glow Aura Halo
        const auraGrad = ctx.createRadialGradient(0, 0, 25, 0, 0, currentRadius * 1.75);
        auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.65)');
        auraGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.35)');
        auraGrad.addColorStop(0.75, 'rgba(147, 51, 234, 0.15)');
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius * 1.75, 0, Math.PI * 2);
        ctx.fill();

        // 4. Layer 1: Outer 36 Razor-Sharp Curved Plasma Flame Blades
        ctx.rotate(rotation);

        const bladeCount = 36;
        ctx.shadowBlur = 32;
        ctx.shadowColor = '#F59E0B';

        for (let i = 0; i < bladeCount; i++) {
          const angle = (i * Math.PI * 2) / bladeCount;
          ctx.save();
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.moveTo(currentRadius, 0);
          ctx.bezierCurveTo(currentRadius + 32, -18, currentRadius + 44, -5, currentRadius + 48, 0);
          ctx.bezierCurveTo(currentRadius + 34, 12, currentRadius + 20, 16, currentRadius, 0);
          ctx.closePath();

          const bladeGrad = ctx.createLinearGradient(currentRadius, -12, currentRadius + 48, 12);
          bladeGrad.addColorStop(0, '#FFFFFF');
          bladeGrad.addColorStop(0.25, '#FEF08A');
          bladeGrad.addColorStop(0.6, '#F59E0B');
          bladeGrad.addColorStop(0.85, '#EA580C');
          bladeGrad.addColorStop(1, '#78350F');
          ctx.fillStyle = bladeGrad;
          ctx.fill();

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.restore();
        }

        // Concentric Main Outer Golden Metallic Ring
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.lineWidth = 8;
        const mainRingGrad = ctx.createLinearGradient(-currentRadius, -currentRadius, currentRadius, currentRadius);
        mainRingGrad.addColorStop(0, '#FFFFFF');
        mainRingGrad.addColorStop(0.3, '#F59E0B');
        mainRingGrad.addColorStop(0.7, '#D97706');
        mainRingGrad.addColorStop(1, '#78350F');
        ctx.strokeStyle = mainRingGrad;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, currentRadius - 10, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FEF08A';
        ctx.stroke();

        // 5. Layer 2: Counter-Rotating 18 Interlocking Inner Diamond Lotus Spokes
        ctx.save();
        ctx.rotate(-rotation * 2.2);

        const spokeCount = 18;
        for (let i = 0; i < spokeCount; i++) {
          const angle = (i * Math.PI * 2) / spokeCount;
          ctx.save();
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(currentRadius - 15, 0);
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Diamond Spoke Tip
          ctx.beginPath();
          ctx.moveTo(currentRadius - 24, 0);
          ctx.lineTo(currentRadius - 14, -6);
          ctx.lineTo(currentRadius - 8, 0);
          ctx.lineTo(currentRadius - 14, 6);
          ctx.closePath();
          ctx.fillStyle = '#F59E0B';
          ctx.fill();

          ctx.restore();
        }

        // Real-Time Electrical Divine Lightning Arcs
        if (Math.random() > 0.3) {
          const boltAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
          boltAngles.forEach((baseAngle) => {
            const boltAngle = baseAngle + (Math.random() - 0.5) * 0.4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const midR = currentRadius * 0.6;
            ctx.lineTo(Math.cos(boltAngle) * midR + (Math.random() - 0.5) * 20, Math.sin(boltAngle) * midR + (Math.random() - 0.5) * 20);
            ctx.lineTo(Math.cos(boltAngle) * currentRadius, Math.sin(boltAngle) * currentRadius);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#60A5FA';
            ctx.stroke();
          });
        }

        // Inner Sacred Rings
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius * 0.55, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#F59E0B';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, currentRadius * 0.38, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#60A5FA';
        ctx.stroke();

        ctx.restore(); // end counter rotation

        // 6. White-Hot Sun Supernova Core Orb
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius * 0.24, 0, Math.PI * 2);
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius * 0.24);
        coreGrad.addColorStop(0, '#FFFFFF');
        coreGrad.addColorStop(0.35, '#FEF08A');
        coreGrad.addColorStop(0.7, '#F59E0B');
        coreGrad.addColorStop(1, '#3B82F6');
        ctx.fillStyle = coreGrad;
        ctx.shadowBlur = 50;
        ctx.shadowColor = '#FFFFFF';
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, showChakra]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: opacity }}
    />
  );
}
