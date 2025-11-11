import React, { useState, useCallback, useMemo } from 'react';
import { modesData } from './data';
import { ProbeState, PinState, PredictedPhysics } from './types';
import { predictPhysicsForParams } from './services/physicsService';
import PhaseSpaceCanvas from './components/PhaseSpaceCanvas';
import InstrumentPanel from './components/InstrumentPanel';
import AICollaborator from './components/AICollaborator';
import DataCore from './components/DataCore';
import Onboarding from './components/Onboarding';

const App: React.FC = () => {
  const [probe, setProbe] = useState<ProbeState | null>(null);
  const [pins, setPins] = useState<PinState[]>(
    modesData.map(m => ({
      id: m.mode,
      novelty: m.stats.avg_components.novelty,
      momentum: m.stats.avg_components.momentum,
      isReal: true,
      modeName: m.mode,
      type: 'real',
    }))
  );
  const [activePin, setActivePin] = useState<PinState | null>(pins[0]);
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('salienceLabOnboardingDismissed'));

  const handleProbe = useCallback((novelty: number, momentum: number) => {
    setProbe({ novelty, momentum });
  }, []);

  const handleCanvasClick = useCallback((novelty: number, momentum: number) => {
    const newPin: PinState = {
      id: `pin-${Date.now()}`,
      novelty,
      momentum,
      isReal: false,
      type: 'virtual',
    };
    setPins(p => [...p, newPin]);
    setActivePin(newPin);
  }, []);

  const handlePinSelect = useCallback((pin: PinState) => {
    setActivePin(pin);
  }, []);
  
  const handleRemovePin = useCallback((pinId: string) => {
    setPins(p => p.filter(pin => pin.id !== pinId));
    if(activePin?.id === pinId) {
        setActivePin(pins.find(p => p.isReal) || null);
    }
  }, [activePin, pins]);

  const probePhysics: PredictedPhysics | null = useMemo(() => {
    if (!probe) return null;
    return predictPhysicsForParams(probe.novelty, probe.momentum, modesData);
  }, [probe]);
  
  const activePinData = useMemo(() => {
    if (!activePin) return null;
    if (activePin.isReal) {
      return modesData.find(m => m.mode === activePin.modeName) || null;
    }
    return null;
  }, [activePin]);
  
   const activePinPhysics: PredictedPhysics | null = useMemo(() => {
    if (!activePin) return null;
    return predictPhysicsForParams(activePin.novelty, activePin.momentum, modesData);
  }, [activePin]);
  
  const dismissOnboarding = () => {
      localStorage.setItem('salienceLabOnboardingDismissed', 'true');
      setShowOnboarding(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-gray-300 flex flex-col">
       {showOnboarding && <Onboarding onDismiss={dismissOnboarding} />}

      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            <h1 className="text-xl font-bold text-gray-100 tracking-tight">Salience Field Laboratory</h1>
          </div>
          <div className="text-xs font-mono text-gray-500">
            {probe ? `Probe: [ N: ${probe.novelty.toFixed(3)}, M: ${probe.momentum.toFixed(3)} ]` : 'Awaiting Probe...'}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 grid grid-rows-6 gap-6">
            <div className="row-span-4">
                 <PhaseSpaceCanvas 
                    onProbe={handleProbe}
                    pins={pins}
                    activePin={activePin}
                    onPinSelect={handlePinSelect}
                    onCanvasClick={handleCanvasClick}
                 />
            </div>
            <div className="row-span-2">
                <DataCore
                    pins={pins}
                    activePin={activePin}
                    onPinSelect={handlePinSelect}
                    onRemovePin={handleRemovePin}
                    realData={activePinData}
                    predictedPhysics={activePinPhysics}
                 />
            </div>
        </div>
        <div className="xl:col-span-4 grid grid-rows-6 gap-6">
             <div className="row-span-2">
                <InstrumentPanel physics={probePhysics} />
             </div>
             <div className="row-span-4">
                 <AICollaborator
                    activePin={activePin}
                    predictedPhysics={activePinPhysics}
                    realData={activePinData}
                 />
             </div>
        </div>
      </main>
    </div>
  );
};

export default App;
