import React, { useRef, useState, useEffect } from 'react';
import { SimulationMode } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SimulationCanvas } from './components/SimulationCanvas';
import { StatisticsView } from './components/StatisticsView';
import { ApplicationsView } from './components/ApplicationsView';
import { AlgorithmView } from './components/AlgorithmView';
import { useSimulation } from './hooks/useSimulation';
import { useSimulationDrawing } from './hooks/useSimulationDrawing';

export default function App() {
  const [mode, setMode] = useState<SimulationMode>('GRID');
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Simulation Parameters
  const [agentCount, setAgentCount] = useState(2000);
  const [radius, setRadius] = useState(40);
  const [tolerance, setTolerance] = useState(0.4);
  const [gridSize, setGridSize] = useState(50);
  const [occupancy, setOccupancy] = useState(0.85);

  const {
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
  } = useSimulation(mode, agentCount, radius, tolerance, gridSize, occupancy);

  const canvasContRef = useRef<HTMLCanvasElement>(null);
  const canvasGridRef = useRef<HTMLCanvasElement>(null);

  useSimulationDrawing(
    mode,
    isRunning,
    stepContinuous,
    stepGrid,
    agentsRef,
    gridRef,
    canvasContRef,
    canvasGridRef,
    gridSize
  );

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 1024;
    const handleResize = () => setIsMobile(checkMobile());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleRunning = () => {
    if (mode === 'DUAL') {
      const next = !isRunning.continuous || !isRunning.grid;
      // Only start if there are unhappy agents or it's the first run
      const canStartCont = next ? (iterations.continuous === 0 || unhappyCount.continuous > 0) : true;
      const canStartGrid = next ? (iterations.grid === 0 || unhappyCount.grid > 0) : true;
      setIsRunning({ 
        continuous: next && canStartCont, 
        grid: next && canStartGrid 
      });
    } else if (mode === 'CONTINUOUS') {
      if (!isRunning.continuous && iterations.continuous > 0 && unhappyCount.continuous === 0) return;
      setIsRunning(prev => ({ ...prev, continuous: !prev.continuous }));
    } else {
      if (!isRunning.grid && iterations.grid > 0 && unhappyCount.grid === 0) return;
      setIsRunning(prev => ({ ...prev, grid: !prev.grid }));
    }
  };

  const handleReset = () => {
    if (mode === 'DUAL') {
      initContinuous(agentCount);
      initGrid(gridSize, occupancy);
    } else if (mode === 'CONTINUOUS') {
      initContinuous(agentCount);
    } else {
      initGrid(gridSize, occupancy);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans selection:bg-indigo-100 overflow-hidden flex flex-col relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-200/10 rounded-full blur-3xl" />
      </div>

      <Header
        mode={mode}
        iterations={iterations}
        unhappyCount={unhappyCount}
        calcTime={calcTime}
        isRunning={isRunning}
        oscillationDetected={oscillationDetected}
        onToggleRunning={handleToggleRunning}
        onReset={handleReset}
        onToggleControls={() => setShowControls(!showControls)}
        showControls={showControls}
      />

      <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        <Sidebar
          mode={mode}
          setMode={setMode}
          showControls={showControls}
          setShowControls={setShowControls}
          isMobile={isMobile}
          agentCount={agentCount}
          setAgentCount={setAgentCount}
          radius={radius}
          setRadius={setRadius}
          gridSize={gridSize}
          setGridSize={setGridSize}
          occupancy={occupancy}
          setOccupancy={setOccupancy}
          tolerance={tolerance}
          setTolerance={setTolerance}
        />

        <div className="flex-1 overflow-y-auto scroll-smooth">
          {mode === 'CONTINUOUS' || mode === 'GRID' || mode === 'DUAL' ? (
            <SimulationCanvas
              mode={mode}
              canvasGridRef={canvasGridRef}
              canvasContRef={canvasContRef}
              isRunning={isRunning}
              oscillationDetected={oscillationDetected}
              iterations={iterations}
              unhappyCount={unhappyCount}
            />
          ) : mode === 'STATISTICS' ? (
            <StatisticsView
              history={history}
              comparison={comparison}
              isRunning={isRunning}
              oscillationDetected={oscillationDetected}
            />
          ) : mode === 'ALGORITHM' ? (
            <AlgorithmView />
          ) : (
            <ApplicationsView />
          )}
        </div>
      </main>
    </div>
  );
}
