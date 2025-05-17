
import React, { useRef, useEffect } from 'react';

interface NetworkBackgroundProps {
  nodeCount?: number;
  connectionCount?: number;
}

const NetworkBackground: React.FC<NetworkBackgroundProps> = ({ 
  nodeCount = 15, 
  connectionCount = 20 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create nodes
    const nodes: {x: number; y: number; size: number; speed: number; direction: number}[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() * Math.PI * 2
      });
    }
    
    // Create connections
    const connections: {from: number; to: number; dashOffset: number; dashSpeed: number}[] = [];
    for (let i = 0; i < connectionCount; i++) {
      connections.push({
        from: Math.floor(Math.random() * nodes.length),
        to: Math.floor(Math.random() * nodes.length),
        dashOffset: Math.random() * 1000,
        dashSpeed: Math.random() * 0.5 + 0.1
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = 'currentColor';
      ctx.lineWidth = 0.5;
      
      connections.forEach(conn => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        
        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        conn.dashOffset += conn.dashSpeed;
        ctx.lineDashOffset = conn.dashOffset;
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });
      
      // Draw and update nodes
      ctx.setLineDash([]);
      nodes.forEach(node => {
        // Update position
        node.x += Math.cos(node.direction) * node.speed;
        node.y += Math.sin(node.direction) * node.speed;
        
        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) {
          node.direction = Math.PI - node.direction;
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.direction = -node.direction;
        }
        
        // Draw node
        ctx.beginPath();
        ctx.fillStyle = 'currentColor';
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodeCount, connectionCount]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[-1] opacity-20 dark:opacity-10 pointer-events-none"
    />
  );
};

export default NetworkBackground;
