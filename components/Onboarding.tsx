import React from 'react';
import Card from './Card';

interface OnboardingProps {
    onDismiss: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onDismiss }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
            <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full p-8 m-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Welcome to the Salience Field Laboratory</h2>
                <p className="text-gray-400 mb-6">This is an interactive instrument for exploring a simulated physical system. Here's how to get started:</p>
                
                <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center font-bold text-cyan-400">1</div>
                        <div>
                            <h3 className="font-semibold text-gray-200">Explore the Phase Space</h3>
                            <p className="text-gray-400">The main canvas is a map of possible system states. Move your mouse (the <span className="font-mono text-xs">Probe</span>) across it to see how the physics change.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center font-bold text-cyan-400">2</div>
                        <div>
                            <h3 className="font-semibold text-gray-200">Read the Instruments</h3>
                            <p className="text-gray-400">The gauges on the right show real-time predictions for your probe's location. Hover over their titles to learn what they mean.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center font-bold text-cyan-400">3</div>
                        <div>
                            <h3 className="font-semibold text-gray-200">Pin Experiments</h3>
                            <p className="text-gray-400">Click anywhere on the canvas to drop a <span className="font-mono text-xs">Virtual Pin</span>. This saves a point of interest for deeper analysis by your AI Lab Partner.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={onDismiss}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Begin Experiment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
