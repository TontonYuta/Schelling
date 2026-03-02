import { useState, useRef, useCallback, useEffect } from 'react';
import { Agent, AgentType, HistoryPoint, ComparisonResult, SimulationMode } from '../types';
import { KDTree, Point } from '../lib/kdtree';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export const useSimulation = (
  mode: SimulationMode,
  agentCount: number,
  radius: number,
  tolerance: number,
  gridSize: number,
  occupancy: number
) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [grid, setGrid] = useState<(AgentType | null)[][]>([]);
  const [iterations, setIterations] = useState({ continuous: 0, grid: 0 });
  const [unhappyCount, setUnhappyCount] = useState({ continuous: 0, grid: 0 });
  const [calcTime, setCalcTime] = useState({ continuous: 0, grid: 0 });
  const [isRunning, setIsRunning] = useState({ continuous: false, grid: false });
  const [oscillationDetected, setOscillationDetected] = useState({ continuous: false, grid: false });
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [comparison, setComparison] = useState<{
    continuous: ComparisonResult | null;
    grid: ComparisonResult | null;
  }>({ continuous: null, grid: null });

  const agentsRef = useRef<Agent[]>([]);
  const gridRef = useRef<(AgentType | null)[][]>([]);
  const requestRef = useRef<number>(null);

  const minUnhappyRef = useRef({ continuous: Infinity, grid: Infinity });
  const noImprovementCountRef = useRef({ continuous: 0, grid: 0 });
  const patience = 50;

  const initContinuous = useCallback((count: number) => {
    const newAgents: Agent[] = [];
    for (let i = 0; i < count; i++) {
      newAgents.push({
        id: i,
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        type: Math.random() > 0.5 ? 'RED' : 'BLUE',
        happy: true,
      });
    }
    agentsRef.current = newAgents;
    setAgents(newAgents);
    setIterations(prev => ({ ...prev, continuous: 0 }));
    
    // Calculate initial unhappy count
    const points: Point[] = newAgents.map(a => ({ x: a.x, y: a.y, id: a.id }));
    const tree = new KDTree(points);
    let initialUnhappy = 0;
    newAgents.forEach(agent => {
      const neighbors = tree.queryRadius({ x: agent.x, y: agent.y }, radius);
      const otherNeighbors = neighbors.filter(n => n.id !== agent.id);
      const sameTypeCount = otherNeighbors.filter(n => newAgents[n.id].type === agent.type).length;
      // Use a minimum denominator of 8 to ensure agents with very few neighbors are unhappy
      const fraction = sameTypeCount / Math.max(otherNeighbors.length, 8);
      if (fraction < tolerance) initialUnhappy++;
    });

    setUnhappyCount(prev => ({ ...prev, continuous: initialUnhappy }));
    setHistory(prev => prev.filter(h => h.mode !== 'CONTINUOUS').concat([{ 
      iteration: 0, 
      unhappyCount: initialUnhappy, 
      happiness: ((count - initialUnhappy) / count) * 100, 
      calcTime: 0,
      mode: 'CONTINUOUS' 
    }]));
    setIsRunning(prev => ({ ...prev, continuous: false }));
    setOscillationDetected(prev => ({ ...prev, continuous: false }));
    minUnhappyRef.current.continuous = initialUnhappy;
    noImprovementCountRef.current.continuous = 0;
  }, [radius, tolerance]);

  const initGrid = useCallback((size: number, occ: number) => {
    const newGrid: (AgentType | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
    const totalCells = size * size;
    const totalAgents = Math.floor(totalCells * occ);
    
    const positions: [number, number][] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        positions.push([r, c]);
      }
    }
    
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    for (let i = 0; i < totalAgents; i++) {
      const [r, c] = positions[i];
      newGrid[r][c] = Math.random() > 0.5 ? 'RED' : 'BLUE';
    }
    
    gridRef.current = newGrid;
    setGrid(newGrid);
    setIterations(prev => ({ ...prev, grid: 0 }));
    
    // Calculate initial unhappy count
    let initialUnhappy = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const type = newGrid[r][c];
        if (type === null) continue;
        let sameType = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
              const neighborType = newGrid[nr][nc];
              if (neighborType === type) sameType++;
            }
          }
        }
        // Use 8 as the denominator for a standard Moore neighborhood
        if ((sameType / 8) < tolerance) initialUnhappy++;
      }
    }

    setUnhappyCount(prev => ({ ...prev, grid: initialUnhappy }));
    setHistory(prev => prev.filter(h => h.mode !== 'GRID').concat([{ 
      iteration: 0, 
      unhappyCount: initialUnhappy, 
      happiness: ((totalAgents - initialUnhappy) / totalAgents) * 100, 
      calcTime: 0,
      mode: 'GRID' 
    }]));
    setIsRunning(prev => ({ ...prev, grid: false }));
    setOscillationDetected(prev => ({ ...prev, grid: false }));
    minUnhappyRef.current.grid = initialUnhappy;
    noImprovementCountRef.current.grid = 0;
  }, [tolerance]);

  const stepContinuous = useCallback(() => {
    const startTime = performance.now();
    const currentAgents = agentsRef.current;
    const points: Point[] = currentAgents.map(a => ({ x: a.x, y: a.y, id: a.id }));
    const tree = new KDTree(points);
    let unhappyFound = 0;
    const nextAgents = currentAgents.map(agent => {
      const neighbors = tree.queryRadius({ x: agent.x, y: agent.y }, radius);
      const otherNeighbors = neighbors.filter(n => n.id !== agent.id);
      const sameTypeCount = otherNeighbors.filter(n => currentAgents[n.id].type === agent.type).length;
      // Use 8 as the denominator to ensure agents with too few neighbors are unhappy
      const fraction = sameTypeCount / 8;
      const isHappy = fraction >= tolerance;
      if (!isHappy) unhappyFound++;
      return { ...agent, happy: isHappy };
    });

    const happiness = ((agentCount - unhappyFound) / agentCount) * 100;

    const movedAgents = nextAgents.map(agent => {
      if (!agent.happy) {
        return { ...agent, x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT };
      }
      return agent;
    });
    const endTime = performance.now();
    const stepTime = endTime - startTime;
    
    const newPoint: HistoryPoint = { 
      iteration: iterations.continuous + 1, 
      unhappyCount: unhappyFound, 
      happiness, 
      calcTime: stepTime,
      mode: 'CONTINUOUS' 
    };

    setHistory(prev => [...prev.slice(-499), newPoint]);

    agentsRef.current = movedAgents;
    setAgents(movedAgents);
    setCalcTime(prev => ({ ...prev, continuous: stepTime }));
    setUnhappyCount(prev => ({ ...prev, continuous: unhappyFound }));
    setIterations(prev => ({ ...prev, continuous: prev.continuous + 1 }));

    // Oscillation detection
    if (unhappyFound < minUnhappyRef.current.continuous) {
      minUnhappyRef.current.continuous = unhappyFound;
      noImprovementCountRef.current.continuous = 0;
    } else {
      noImprovementCountRef.current.continuous += 1;
    }

    if (noImprovementCountRef.current.continuous >= patience) {
      setIsRunning(prev => ({ ...prev, continuous: false }));
      setOscillationDetected(prev => ({ ...prev, continuous: true }));
      return;
    }

    if (unhappyFound === 0) {
      setIsRunning(prev => ({ ...prev, continuous: false }));
      
      setComparison(prev => {
        // We use the current history plus the new point for accurate average
        const contHistory = history.filter(h => h.mode === 'CONTINUOUS');
        const avgCalc = contHistory.length > 0 
          ? (contHistory.reduce((acc, h) => acc + h.calcTime, 0) + stepTime) / (contHistory.length + 1)
          : stepTime;

        return {
          ...prev,
          continuous: { 
            iterations: iterations.continuous + 1, 
            finalHappiness: happiness, 
            agentCount,
            avgCalcTime: avgCalc
          }
        };
      });
    }
  }, [radius, tolerance, agentCount, iterations.continuous]);

  const stepGrid = useCallback(() => {
    const startTime = performance.now();
    const currentGrid = gridRef.current;
    const size = gridSize;
    const nextGrid = currentGrid.map(row => [...row]);
    const unhappyPositions: [number, number][] = [];
    const emptyPositions: [number, number][] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const type = currentGrid[r][c];
        if (type === null) {
          emptyPositions.push([r, c]);
          continue;
        }
        let sameType = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
              const neighborType = currentGrid[nr][nc];
              if (neighborType === type) sameType++;
            }
          }
        }
        // Use 8 as the denominator for a standard Moore neighborhood
        const happy = (sameType / 8) >= tolerance;
        if (!happy) unhappyPositions.push([r, c]);
      }
    }
    const totalAgents = Math.floor(gridSize * gridSize * occupancy);
    const happiness = ((totalAgents - unhappyPositions.length) / totalAgents) * 100;

    unhappyPositions.sort(() => Math.random() - 0.5);
    emptyPositions.sort(() => Math.random() - 0.5);
    const moves = Math.min(unhappyPositions.length, emptyPositions.length);
    for (let i = 0; i < moves; i++) {
      const [ur, uc] = unhappyPositions[i];
      const [er, ec] = emptyPositions[i];
      nextGrid[er][ec] = nextGrid[ur][uc];
      nextGrid[ur][uc] = null;
    }

    const endTime = performance.now();
    const stepTime = endTime - startTime;

    const newPoint: HistoryPoint = { 
      iteration: iterations.grid + 1, 
      unhappyCount: unhappyPositions.length, 
      happiness, 
      calcTime: stepTime,
      mode: 'GRID' 
    };

    setHistory(prev => [...prev.slice(-499), newPoint]);

    setCalcTime(prev => ({ ...prev, grid: stepTime }));
    setUnhappyCount(prev => ({ ...prev, grid: unhappyPositions.length }));
    
    // Oscillation detection
    const currentUnhappy = unhappyPositions.length;
    if (currentUnhappy < minUnhappyRef.current.grid) {
      minUnhappyRef.current.grid = currentUnhappy;
      noImprovementCountRef.current.grid = 0;
    } else {
      noImprovementCountRef.current.grid += 1;
    }

    if (noImprovementCountRef.current.grid >= patience) {
      setIsRunning(prev => ({ ...prev, grid: false }));
      setOscillationDetected(prev => ({ ...prev, grid: true }));
      return;
    }

    if (unhappyPositions.length === 0) {
      setIsRunning(prev => ({ ...prev, grid: false }));

      setComparison(prev => {
        const gridHistory = history.filter(h => h.mode === 'GRID');
        const avgCalc = gridHistory.length > 0 
          ? (gridHistory.reduce((acc, h) => acc + h.calcTime, 0) + stepTime) / (gridHistory.length + 1)
          : stepTime;

        return {
          ...prev,
          grid: { 
            iterations: iterations.grid + 1, 
            finalHappiness: happiness, 
            agentCount: totalAgents,
            avgCalcTime: avgCalc
          }
        };
      });
      return;
    }
    gridRef.current = nextGrid;
    setGrid(nextGrid);
    setIterations(prev => ({ ...prev, grid: prev.grid + 1 }));
  }, [gridSize, tolerance, iterations.grid, occupancy]);

  useEffect(() => {
    if (mode === 'CONTINUOUS') {
      initContinuous(agentCount);
    } else if (mode === 'GRID') {
      initGrid(gridSize, occupancy);
    } else if (mode === 'DUAL') {
      initContinuous(agentCount);
      initGrid(gridSize, occupancy);
    }
  }, [mode, initContinuous, initGrid, agentCount, gridSize, occupancy]);

  return {
    agents,
    grid,
    iterations,
    unhappyCount,
    calcTime,
    isRunning,
    setIsRunning,
    oscillationDetected,
    history,
    comparison,
    initContinuous,
    initGrid,
    stepContinuous,
    stepGrid,
    agentsRef,
    gridRef,
    requestRef,
  };
};
