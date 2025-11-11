import React from 'react';
import { PredictedPhysics } from '../types';
import Card from './Card';
import { GaugeIcon } from './icons';
import Tooltip from './Tooltip';

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  tooltip: string;
}

const Gauge: React.FC<GaugeProps> = ({ label, value, max, unit, color, tooltip }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
         <Tooltip content={tooltip}>
            <span className="text-sm text-gray-400 border-b border-dashed border-gray-600 cursor-help">{label}</span>
        </Tooltip>
        <span className="font-mono font-semibold text-lg text-gray-100">
            {value.toFixed(label === 'Anisotropy' ? 4 : 1)}
            <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div 
            className={`h-2 rounded-full transition-all duration-150 ease-out ${color}`}
            style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const InstrumentPanel: React.FC<{ physics: PredictedPhysics | null }> = ({ physics }) => {
  const p = physics;
  const confidence = p ? p.confidence : 0;
  const displayOpacity = confidence > 0.1 ? confidence : 0.1;

  return (
    <Card title="Probe Instrumentation" icon={<GaugeIcon />}>
       {p && p.novelty > 0 ? (
            <div className="space-y-4" style={{ opacity: displayOpacity }}>
                <Gauge label="Anisotropy" value={p.anisotropy} max={1.0} unit="A4" color="bg-cyan-500" tooltip="Measures order and structure. High values (~1.0) suggest a crystalline or highly organized pattern. Low values imply disorder." />
                <Gauge label="Correlation" value={p.corr_length} max={150} unit="px" color="bg-purple-500" tooltip="Represents the average distance over which field points are related. High values indicate long-range interactions." />
                <Gauge label="Complexity" value={p.complexity} max={200} unit="iter" color="bg-orange-500" tooltip="The number of iterations required for the simulation to converge. High values suggest chaotic or 'turbulent' dynamics." />
                <div className="text-center pt-2">
                     <div className="text-lg font-bold" style={{ color: p.classification.pattern === 'VORTEX' ? '#FF1493' : p.classification.pattern === 'CRYSTALLINE' ? '#FFD700' : 'white' }}>
                        {p.classification.pattern}
                    </div>
                     <div className="text-xs text-gray-500">Hypothesized State</div>
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-600">
                <p>Move probe over Phase Space Canvas to get readings.</p>
            </div>
        )}
    </Card>
  );
};

export default InstrumentPanel;
