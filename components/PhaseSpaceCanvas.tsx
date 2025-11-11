import React, { useRef, useEffect, useState } from 'react';
import { modesData } from '../data';
import { predictPhysicsForParams } from '../services/physicsService';
import { PinState } from '../types';
import Card from './Card';

interface PhaseSpaceCanvasProps {
    onProbe: (novelty: number, momentum: number) => void;
    pins: PinState[];
    activePin: PinState | null;
    onPinSelect: (pin: PinState) => void;
    onCanvasClick: (novelty: number, momentum: number) => void;
}

const patternColors: { [key: string]: string } = {
    CRYSTALLINE: '#FFD700', VORTEX: '#FF1493', TURBULENT: '#FF4500',
    PHASE_BOUNDARY: '#00CED1', NUCLEATION: '#32CD32', MIXED: '#9370DB', UNKNOWN: '#4B5563'
};

const PhaseSpaceCanvas: React.FC<PhaseSpaceCanvasProps> = ({ onProbe, pins, activePin, onPinSelect, onCanvasClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const vectorCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ width: 0, height: 0 });

    const noveltyRange = { min: 0.35, max: 0.95 };
    const momentumRange = { min: 0.40, max: 1.05 };

    const coordToParam = (x: number, y: number) => {
        const novelty = noveltyRange.min + (y / dims.height) * (noveltyRange.max - noveltyRange.min);
        const momentum = momentumRange.min + (x / dims.width) * (momentumRange.max - momentumRange.min);
        return { novelty, momentum };
    };

    const paramToCoord = (novelty: number, momentum: number) => {
        const y = ((novelty - noveltyRange.min) / (noveltyRange.max - noveltyRange.min)) * dims.height;
        const x = ((momentum - momentumRange.min) / (momentumRange.max - momentumRange.min)) * dims.width;
        return { x, y };
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDims({ width, height });
            }
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !vectorCanvasRef.current || dims.width === 0) return;
        const canvas = canvasRef.current;
        const vectorCanvas = vectorCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const vectorCtx = vectorCanvas.getContext('2d');
        if (!ctx || !vectorCtx) return;

        canvas.width = dims.width;
        canvas.height = dims.height;
        vectorCanvas.width = dims.width;
        vectorCanvas.height = dims.height;

        // Draw the background color map
        const GRID_DENSITY = 40;
        const cellWidth = dims.width / GRID_DENSITY;
        const cellHeight = dims.height / GRID_DENSITY;

        for (let i = 0; i < GRID_DENSITY; i++) {
            for (let j = 0; j < GRID_DENSITY; j++) {
                const { novelty, momentum } = coordToParam(j * cellWidth + cellWidth / 2, i * cellHeight + cellHeight / 2);
                const physics = predictPhysicsForParams(novelty, momentum, modesData);
                
                ctx.globalAlpha = 0.15 + Math.pow(physics.confidence, 2) * 0.5;
                ctx.fillStyle = patternColors[physics.classification.pattern] || '#4B5563';
                ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            }
        }
        ctx.globalAlpha = 1.0;

        // Animate vector field
        let frameId: number;
        let time = 0;
        const drawVectorField = () => {
            vectorCtx.clearRect(0, 0, dims.width, dims.height);
            vectorCtx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
            vectorCtx.lineWidth = 0.5;
            
            const VECTOR_DENSITY = 20;
            const vecCellWidth = dims.width / VECTOR_DENSITY;
            const vecCellHeight = dims.height / VECTOR_DENSITY;

            for (let i = 0; i < VECTOR_DENSITY; i++) {
                for (let j = 0; j < VECTOR_DENSITY; j++) {
                    const x = j * vecCellWidth + vecCellWidth/2;
                    const y = i * vecCellHeight + vecCellHeight/2;
                    
                    // Simple gradient approximation: flow from high complexity to low
                    const { novelty, momentum } = coordToParam(x, y);
                    const p1 = predictPhysicsForParams(novelty + 0.01, momentum, modesData);
                    const p2 = predictPhysicsForParams(novelty - 0.01, momentum, modesData);
                    const p3 = predictPhysicsForParams(novelty, momentum + 0.01, modesData);
                    const p4 = predictPhysicsForParams(novelty, momentum - 0.01, modesData);
                    
                    const gradX = p3.complexity - p4.complexity;
                    const gradY = p1.complexity - p2.complexity;

                    const angle = Math.atan2(gradY, gradX) + Math.sin(time + i*0.1) * 0.2;
                    const length = 5;

                    vectorCtx.beginPath();
                    vectorCtx.moveTo(x, y);
                    vectorCtx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
                    vectorCtx.stroke();
                }
            }
            time += 0.01;
            frameId = requestAnimationFrame(drawVectorField);
        };
        drawVectorField();

        return () => cancelAnimationFrame(frameId);

    }, [dims]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const { novelty, momentum } = coordToParam(e.clientX - rect.left, e.clientY - rect.top);
        onProbe(novelty, momentum);
    };
    
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const { novelty, momentum } = coordToParam(e.clientX - rect.left, e.clientY - rect.top);
        onCanvasClick(novelty, momentum);
    }

    return (
        <Card title="Phase Space Canvas" className="overflow-hidden">
            <div ref={containerRef} className="absolute inset-0 cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={() => onProbe(0,0)} onClick={handleClick}>
                <canvas ref={vectorCanvasRef} className="absolute inset-0 opacity-50" />
                <canvas ref={canvasRef} className="absolute inset-0" />
                <div className="absolute inset-0 pointer-events-none">
                    {pins.map(pin => {
                        const { x, y } = paramToCoord(pin.novelty, pin.momentum);
                        const isActive = activePin?.id === pin.id;
                        return (
                             <div key={pin.id}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group`}
                                style={{ left: `${x}px`, top: `${y}px` }}
                                onClick={(e) => { e.stopPropagation(); onPinSelect(pin); }}
                            >
                                <div className={`w-3 h-3 rounded-full transition-all duration-200 ${ pin.isReal ? 'bg-cyan-400' : 'bg-white' } ${isActive ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : 'ring-1 ring-black/50'}`}></div>
                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white whitespace-nowrap opacity-80 group-hover:opacity-100" style={{textShadow: '0 0 5px black, 0 0 5px black'}}>{pin.modeName || 'Virtual Pin'}</span>
                            </div>
                        )
                    })}
                </div>
                 <div className="absolute bottom-2 left-3 text-xs text-gray-400 bg-gray-950/50 px-2 py-1 rounded">
                    Color: Hypothesized State | Opacity: Extrapolation Certainty
                </div>
            </div>
        </Card>
    );
};

export default PhaseSpaceCanvas;
