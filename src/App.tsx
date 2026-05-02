/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Settings, 
  Activity, 
  Wrench, 
  Box, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Zap,
  Wind,
  Loader2,
  CircleDot,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VINToModelMapper } from './services/VINToModelMapper';
import { DigitalTwinEngine } from './services/DigitalTwinEngine';
import { VINData, PartImpactAnalysis } from './types/automotive';
import { PART_REGISTRY } from './data/factorySpecs';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Header = () => (
  <header className="h-14 border-b border-app-border flex items-center justify-between px-6 bg-app-surface z-50">
    <div className="flex items-center gap-8">
      <div className="text-xs tracking-[0.2em] font-bold text-brand-primary font-mono italic">PRO-SPEC // DYNAMICS v4.2</div>
      <div className="h-4 w-[1px] bg-app-border"></div>
      <div className="flex gap-4 items-center text-[10px] uppercase font-semibold text-app-muted">
        <span className="text-white">SYSTEM_STATUS:</span>
        <span className="font-mono text-brand-primary">SYNCED</span>
      </div>
    </div>
    <div className="flex gap-6 text-[10px] font-mono">
      <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(0,255,65,0.4)]"></div> FEA_CORE</div>
      <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(0,255,65,0.4)]"></div> CFD_READY</div>
      <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-danger rounded-full animate-pulse shadow-[0_0_8px_rgba(255,68,68,0.4)]"></div> LIVE_RENDER</div>
    </div>
  </header>
);

const CollapsibleSection = ({ title, children, icon: Icon, defaultOpen = true }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-app-border bg-app-surface/30 overflow-hidden mb-2 rounded shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-brand-primary/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-3.5 h-3.5", isOpen ? "text-brand-primary" : "text-app-muted")} />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-3 h-3 text-app-muted" /> : <ChevronRight className="w-3 h-3 text-app-muted" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="p-4 border-t border-app-border bg-black/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<VINData | null>(null);
  const [simulationData, setSimulationData] = useState<PartImpactAnalysis | null>(null);
  const [activePart, setActivePart] = useState<any>(null);
  
  const mapper = new VINToModelMapper();
  const engine = new DigitalTwinEngine();

  const handleVINSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && vin.length >= 11) {
      setIsLoading(true);
      const result = await mapper.mapVINTo3D(vin);
      if (result.status === 'SUCCESS') {
        setVehicleData(result.spec);
        // Promptly simulate an initial part impact or clear previous
        setSimulationData(null);
        setActivePart(null);
      }
      setIsLoading(false);
    }
  };

  const handlePartSelect = async (part: any) => {
    if (!vehicleData) return;
    setIsLoading(true);
    setActivePart(part);
    const sim = await engine.analyzePartImpact(vehicleData, part);
    setSimulationData(sim);
    setIsLoading(false);
  };

  const AVAILABLE_PARTS = [
    { id: 'intake-v3', name: 'Cold Air Intake Pro', category: 'INTAKE', massKg: -2.3 },
    { id: 'exhaust-ti', name: 'Titanium Cat-back', category: 'EXHAUST', massKg: -15.4 },
    { id: 'ecu-flash', name: 'DYNAMICS Stage 2+', category: 'TUNER', massKg: 0 },
    { id: 'aero-wing', name: 'GT4 High-Downforce Wing', category: 'AERO', massKg: 12.0 },
  ];

  return (
    <div className="flex flex-col h-screen bg-app-bg text-app-text selection:bg-brand-primary selection:text-app-bg overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-app-border bg-[#121418] flex flex-col h-full z-40 tech-grid">
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar relative z-10">
            <div className="space-y-2 mb-4">
              <label className="font-mono text-[9px] text-app-muted uppercase tracking-[0.2em] px-1">VIN_BUFFER // PROTOCOL</label>
              <div className="relative">
                {isLoading ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                )}
                <input 
                  type="text" 
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  onKeyDown={handleVINSearch}
                  placeholder="ID_SEQUENCE..."
                  className="w-full bg-black/40 border border-app-border rounded py-3 pl-10 pr-4 text-[11px] font-mono text-brand-primary placeholder:text-app-muted/30 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <CollapsibleSection title="Chassis_Telemetry" icon={Activity}>
              <AnimatePresence mode="wait">
                {vehicleData ? (
                  <motion.div 
                    key="telemetry"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-end border-b border-app-border/30 pb-2">
                       <span className="text-[9px] font-mono text-app-muted uppercase font-bold italic tracking-tighter">Model / Spec</span>
                       <span className="text-[11px] font-mono text-white font-bold">{vehicleData.year} {vehicleData.make}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[8px] font-mono text-app-muted uppercase tracking-tighter">Propulsion</div>
                        <div className="text-[10px] font-mono text-brand-secondary leading-none">{vehicleData.engine.forcedInduction}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[8px] font-mono text-app-muted uppercase tracking-tighter">Wheelbase</div>
                        <div className="text-[10px] font-mono text-white leading-none">{vehicleData.chassis.wheelbase}</div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-[9px] font-mono text-app-muted/40 text-center py-4 uppercase italic">ID_SEQUENCE_REQUIRED</div>
                )}
              </AnimatePresence>
            </CollapsibleSection>

            <CollapsibleSection title="Part_Registry" icon={Box}>
              <div className="space-y-1.5">
                {PART_REGISTRY.map(part => (
                  <button 
                    key={part.id}
                    onClick={() => handlePartSelect(part)}
                    className={cn(
                      "w-full p-2.5 border text-left group transition-all rounded relative overflow-hidden",
                      activePart?.id === part.id 
                        ? "bg-brand-primary/10 border-brand-primary/40 shadow-[0_0_15px_rgba(0,255,65,0.05)]" 
                        : "bg-black/20 border-app-border hover:border-brand-primary/30"
                    )}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="font-mono text-[9px] text-white uppercase tracking-wider">{part.name}</span>
                      <CircleDot className={cn("w-3 h-3 transition-colors", activePart?.id === part.id ? "text-brand-primary" : "text-app-muted/20")} />
                    </div>
                    <div className="flex justify-between items-center mt-1 relative z-10">
                      <span className="text-[8px] font-mono text-app-muted uppercase tracking-tighter">{part.category}</span>
                      <span className={cn("text-[8px] font-mono uppercase font-bold", part.hpGain > 0 ? "text-brand-primary" : "text-brand-danger")}>
                        {part.hpGain > 0 ? `+${part.hpGain}` : part.hpGain} HP_Δ
                      </span>
                    </div>
                    {activePart?.id === part.id && (
                      <motion.div layoutId="part-indicator" className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Mechanical_HUD" icon={Wrench} defaultOpen={false}>
              <div className="bg-brand-primary/5 border border-brand-primary/10 p-4 space-y-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                  <span className="font-mono text-[9px] text-brand-primary font-bold uppercase tracking-widest italic">Live_Active</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-app-muted uppercase">
                      <span>TORQUE_SPEC</span>
                      <span className="text-white font-bold">{activePart?.torqueSpec || '---'}</span>
                    </div>
                    <div className="h-0.5 w-full bg-app-border" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[8px] font-mono text-app-muted uppercase">Required_Tools</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(activePart?.tools || ["SYS_AUTO"]).map((tool: string) => (
                        <div key={tool} className="text-[9px] font-mono px-2 py-1 bg-black/40 border border-app-border text-brand-secondary rounded-sm">
                          {tool}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Solver_Metadata" icon={Activity} defaultOpen={false}>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/30 border border-app-border p-2 rounded">
                    <div className="text-[8px] font-mono text-app-muted uppercase">Iterations</div>
                    <div className="text-[10px] font-mono text-white">8,192</div>
                  </div>
                  <div className="bg-black/30 border border-app-border p-2 rounded">
                    <div className="text-[8px] font-mono text-app-muted uppercase">Solver_Hz</div>
                    <div className="text-[10px] font-mono text-white">120</div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </aside>

        <main className="flex-1 relative bg-[#090A0C] overflow-hidden">
          {/* 3D Scene */}
          <div className="absolute inset-0">
            <Canvas shadows dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[5, 2, 5]} />
              <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
              
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.4}>
                  {/* Placeholder Car Model */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[4, 1, 2]} />
                    <meshStandardMaterial color={vehicleData ? "#2c2c2c" : "#1a1a1a"} roughness={0.1} metalness={0.8} />
                  </mesh>
                  <mesh position={[0, -0.6, 0]} rotation={[Math.PI/2, 0, 0]} receiveShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
                    <meshStandardMaterial color="#333" />
                  </mesh>
                </Stage>
                <Environment preset="night" />
              </Suspense>

              <Grid 
                sectionSize={3} 
                sectionThickness={1.5} 
                sectionColor="#2A2D35" 
                cellSize={1} 
                cellThickness={1} 
                cellColor="#16181D" 
                infiniteGrid 
                fadeDistance={30}
              />
            </Canvas>
          </div>

          {/* HUD Overlays */}
          <AnimatePresence>
            {simulationData && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none"
              >
                <div className="bg-app-bg/80 backdrop-blur-md border border-app-border p-5 pointer-events-auto shadow-2xl rounded-lg min-w-[240px]">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-brand-primary" />
                    <div>
                      <div className="font-mono text-[9px] text-app-muted uppercase tracking-[0.2em] mb-1">Performance_Delta</div>
                      <div className="font-mono text-2xl text-white font-bold tracking-tighter">
                        +{simulationData.performanceDelta.horsepower.gain.toFixed(1)} <span className="text-xs text-app-muted font-normal">HP</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-app-muted uppercase">
                      <span>SOLVER_CONFIDENCE</span>
                      <span className="text-brand-primary">{(simulationData.performanceDelta.horsepower.confidenceInterval * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1 w-full bg-app-border rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-brand-primary shadow-[0_0_8px_rgba(0,255,65,0.4)]" 
                        initial={{ width: 0 }}
                        animate={{ width: `${(simulationData.performanceDelta.horsepower.gain / 50) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <div className="font-mono text-[8px] text-app-muted mt-3 uppercase tracking-tighter border-t border-app-border pt-2">
                    ENG: {simulationData.simulationMetadata.feaEngine}
                  </div>
                </div>

                <div className="flex flex-col gap-3 items-end">
                  {simulationData.physicalTolerance.clearanceCheck.status === 'WARNING' && (
                    <div className="bg-brand-danger/10 backdrop-blur-md border border-brand-danger/30 p-4 pointer-events-auto flex items-center gap-3 rounded pointer-events-auto shadow-lg">
                      <AlertTriangle className="w-5 h-5 text-brand-danger" />
                      <div className="font-mono text-[10px] text-brand-danger font-bold uppercase tracking-widest leading-tight text-right text-balance">
                        INTERFERENCE_ALERT: <br /> {simulationData.physicalTolerance.clearanceCheck.criticalInterferencePoints[0]}
                      </div>
                    </div>
                  )}
                  <div className="bg-brand-primary/10 backdrop-blur-md border border-brand-primary/30 p-4 pointer-events-auto flex items-center gap-3 rounded shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                    <div className="font-mono text-[10px] text-brand-primary font-bold uppercase tracking-widest leading-tight">
                      LOAD_RATING: PASS <br /> {simulationData.physicalTolerance.structuralIntegrity.loadRatingKg}KG NOMINAL
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {simulationData && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute bottom-6 right-6"
              >
                <div className="bg-app-surface/90 border border-app-border p-6 space-y-4 w-[400px] backdrop-blur-xl shadow-2xl rounded-lg">
                  <div className="font-mono text-[10px] text-app-muted uppercase tracking-[0.2em] border-b border-app-border pb-3 flex justify-between">
                    <span>MULTI_CHASSIS_COMPARISON</span>
                    <span className="text-brand-secondary">MATRIX_V4</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="font-mono text-[9px] text-app-muted uppercase">ACTIVE: {vehicleData?.model}</div>
                        <div className="font-mono text-lg text-brand-primary font-bold">+{((simulationData.performanceDelta.horsepower.gain/380)*100).toFixed(1)}% <span className="text-[9px] font-normal opacity-50 uppercase tracking-tighter">Efficiency</span></div>
                      </div>
                      <div className="h-1 w-full bg-app-border rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-brand-primary" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(simulationData.performanceDelta.horsepower.gain/10)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="font-mono text-[9px] text-app-muted uppercase">BENCHMARK: BASELINE M2</div>
                        <div className="font-mono text-lg text-brand-secondary font-bold">+9.1% <span className="text-[9px] font-normal opacity-50 uppercase tracking-tighter">Efficiency</span></div>
                      </div>
                      <div className="h-1 w-full bg-app-border rounded-full overflow-hidden">
                        <div className="h-full bg-brand-secondary w-[45%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-app-border flex items-center px-6 justify-between bg-app-surface">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_6px_rgba(0,255,65,0.6)]" />
            <span className="font-mono text-[9px] text-app-muted uppercase tracking-[0.2em]">Live_Stream: Active</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="font-mono text-[9px] text-app-muted uppercase">Process_Load: 12%</span>
            <span className="font-mono text-[9px] text-brand-secondary uppercase">IO_Lat: 0.12ms</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] text-app-muted uppercase tracking-widest italic opacity-50">PRO-SPEC DYNAMICS // CORE_ENG_4.2.1</span>
        </div>
      </footer>
    </div>
  );
}
