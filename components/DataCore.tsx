import React, { useMemo } from 'react';
import Card from './Card';
import { PinState, ModeData, PredictedPhysics, AblationImpact } from '../types';
import { PinIcon } from './icons';
import { calculateAblationImpacts } from '../services/physicsService';

interface DataCoreProps {
    pins: PinState[];
    activePin: PinState | null;
    onPinSelect: (pin: PinState) => void;
    onRemovePin: (pinId: string) => void;
    realData: ModeData | null;
    predictedPhysics: PredictedPhysics | null;
}

const StatItem: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="flex justify-between items-baseline text-xs py-1.5 border-b border-gray-800/50">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono font-medium text-gray-200">
            {typeof value === 'number' ? value.toFixed(4) : value}
            {unit && <span className="text-gray-500 ml-1">{unit}</span>}
        </span>
    </div>
);

const ImpactBar: React.FC<{ value: number }> = ({ value }) => {
    const isPositive = value > 0;
    const width = Math.min(Math.abs(value), 100);
    return (
        <div className="w-full bg-gray-800 rounded-sm h-4 flex items-center">
            <div 
                className={`h-full rounded-sm ${isPositive ? 'bg-green-500/50' : 'bg-red-500/50'}`}
                style={{ width: `${width}%`}}
            />
            <span className="text-xs font-mono ml-2">{value.toFixed(1)}%</span>
        </div>
    )
}

const AblationImpactDisplay: React.FC<{ impacts: AblationImpact[] }> = ({ impacts }) => (
    <div className="mt-4">
        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ablation Impact (% Change)</h5>
        <div className="text-xs space-y-2">
            {impacts.map(impact => (
                <div key={impact.name}>
                    <span className="font-semibold text-gray-300">Removing {impact.name}</span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                        <span className="text-gray-400">Anisotropy</span>
                        <ImpactBar value={impact.anisotropy_impact} />
                        <span className="text-gray-400">Corr. Length</span>
                        <ImpactBar value={impact.corr_length_impact} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DataCore: React.FC<DataCoreProps> = ({ pins, activePin, onPinSelect, onRemovePin, realData, predictedPhysics }) => {
    const ablationImpacts = useMemo(() => {
        if (!realData) return null;
        return calculateAblationImpacts(realData);
    }, [realData]);
    
    return (
        <Card title="Data Core & Experimental Pins" icon={<PinIcon />}>
            <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-6">
                <div className="md:col-span-1 h-full flex flex-col">
                     <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pinned Coordinates</h4>
                     <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-1">
                        {pins.map(pin => (
                             <button
                                key={pin.id}
                                onClick={() => onPinSelect(pin)}
                                className={`w-full text-left p-2 rounded-md text-xs group transition-colors flex justify-between items-center ${activePin?.id === pin.id ? 'bg-cyan-900/50' : 'hover:bg-gray-800/70'}`}
                            >
                                <div>
                                    <span className={`font-bold ${pin.isReal ? 'text-cyan-400' : 'text-gray-200'}`}>
                                        {pin.isReal ? pin.modeName : 'Virtual Pin'}
                                    </span>
                                    <span className="font-mono text-gray-500 block">
                                        N:{pin.novelty.toFixed(2)}, M:{pin.momentum.toFixed(2)}
                                    </span>
                                </div>
                                {!pin.isReal && (
                                     <button
                                        onClick={(e) => { e.stopPropagation(); onRemovePin(pin.id); }}
                                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-lg font-bold leading-none"
                                        aria-label="Remove Pin"
                                     >
                                        &times;
                                     </button>
                                )}
                            </button>
                        ))}
                     </div>
                </div>
                <div className="md:col-span-2 overflow-y-auto">
                    {activePin && predictedPhysics && (
                         <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                     {activePin.isReal ? 'Measured Data' : 'Predicted Data'}
                                </h4>
                                 <span className={`text-xs px-2 py-0.5 rounded-full ${activePin.isReal ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}`}>
                                    {predictedPhysics.classification.pattern}
                                 </span>
                             </div>

                             <div className="mt-2 space-y-1">
                                {realData ? (
                                    <>
                                        <StatItem label="Anisotropy" value={realData.anisotropy_a4} />
                                        <StatItem label="Corr. Length" value={realData.corr_length} unit="px" />
                                        <StatItem label="Mean Iterations" value={realData.stats.iterations_mean} />
                                        <StatItem label="Max Iterations" value={realData.stats.iterations_max} />
                                        <StatItem label="Novelty (Avg)" value={realData.stats.avg_components.novelty} />
                                        <StatItem label="Momentum (Avg)" value={realData.stats.avg_components.momentum} />
                                    </>
                                ) : (
                                     <>
                                        <StatItem label="Anisotropy" value={predictedPhysics.anisotropy} />
                                        <StatItem label="Corr. Length" value={predictedPhysics.corr_length} unit="px" />
                                        <StatItem label="Complexity (iter)" value={predictedPhysics.complexity} />
                                        <StatItem label="Extrapolation Certainty" value={`${(predictedPhysics.confidence * 100).toFixed(1)}%`} />
                                     </>
                                )}
                             </div>
                             {ablationImpacts && <AblationImpactDisplay impacts={ablationImpacts} />}
                         </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default DataCore;
