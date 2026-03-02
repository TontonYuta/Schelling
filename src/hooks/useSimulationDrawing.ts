import React, { useEffect } from 'react';
import { SimulationMode, Agent, AgentType } from '../types';
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export const useSimulationDrawing = (
  mode: SimulationMode,
  isRunning: { continuous: boolean; grid: boolean },
  stepContinuous: () => void,
  stepGrid: () => void,
  agentsRef: React.MutableRefObject<Agent[]>,
  gridRef: React.MutableRefObject<(AgentType | null)[][]>,
  canvasContRef: React.RefObject<HTMLCanvasElement>,
  canvasGridRef: React.RefObject<HTMLCanvasElement>,
  gridSize: number
) => {
  useEffect(() => {
    let requestRef: number;

    const draw = () => {
      // Draw Continuous
      if (canvasContRef.current && (mode === 'CONTINUOUS' || mode === 'DUAL')) {
        const ctx = canvasContRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = COLORS.BG;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.strokeStyle = COLORS.GRID;
          ctx.lineWidth = 1;
          for (let x = 0; x < CANVAS_WIDTH; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
          }
          for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
          }
          agentsRef.current.forEach(agent => {
            ctx.beginPath();
            ctx.arc(agent.x, agent.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[agent.type];
            ctx.fill();
            if (!agent.happy) {
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          });
        }
      }
      // Draw Grid
      if (canvasGridRef.current && (mode === 'GRID' || mode === 'DUAL')) {
        const ctx = canvasGridRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = COLORS.BG;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          const cellSize = CANVAS_HEIGHT / gridSize;
          const offsetX = (CANVAS_WIDTH - cellSize * gridSize) / 2;
          const offsetY = (CANVAS_HEIGHT - cellSize * gridSize) / 2;
          for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
              const type = gridRef.current[r][c];
              if (type) {
                ctx.fillStyle = COLORS[type];
                ctx.fillRect(offsetX + c * cellSize + 1, offsetY + r * cellSize + 1, cellSize - 2, cellSize - 2);
              } else {
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(offsetX + c * cellSize + 1, offsetY + r * cellSize + 1, cellSize - 2, cellSize - 2);
              }
            }
          }
        }
      }
    };

    const animate = () => {
      if (mode === 'CONTINUOUS' || mode === 'DUAL') {
        if (isRunning.continuous) stepContinuous();
      }
      if (mode === 'GRID' || mode === 'DUAL') {
        if (isRunning.grid) stepGrid();
      }
      draw();
      requestRef = requestAnimationFrame(animate);
    };

    requestRef = requestAnimationFrame(animate);
    return () => {
      if (requestRef) cancelAnimationFrame(requestRef);
    };
  }, [isRunning, mode, stepContinuous, stepGrid, gridSize, agentsRef, gridRef, canvasContRef, canvasGridRef]);
};
