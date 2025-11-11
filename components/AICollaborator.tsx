import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PinState, PredictedPhysics, ModeData } from '../types';
import Card from './Card';
import { BrainIcon, ScienceIcon } from './icons';

interface AICollaboratorProps {
  activePin: PinState | null;
  predictedPhysics: PredictedPhysics | null;
  realData: ModeData | null;
}

const AICollaborator: React.FC<AICollaboratorProps> = ({ activePin, predictedPhysics, realData }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'analysis' | 'design'>('analysis');
  const [designGoal, setDesignGoal] = useState('');

  const generateContent = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setAnalysis(response.text);
    } catch (err) {
      console.error(err);
      setError('AI request failed. Ensure your API key is correctly configured.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateAnalysis = useCallback(() => {
    if (!activePin || !predictedPhysics) return;
    
    const prompt = `
You are a skeptical but insightful physicist collaborating in a lab.
Your role is to analyze data from a Salience Field simulation and guide the research with scientific rigor.
Analyze the following data point and provide a concise interpretation in markdown using the specified structure. **DO NOT** use prose. Adhere strictly to the headings provided.

**DATA FOR ANALYSIS:**
- **Point Type:** ${activePin.isReal ? `**REAL MEASUREMENT** (Mode: ${activePin.modeName})` : `**VIRTUAL PROBE** (Hypothetical)`}
- **Coordinates:** Novelty=${activePin.novelty.toFixed(3)}, Momentum=${activePin.momentum.toFixed(3)}
- **Prediction:** ${predictedPhysics.classification.pattern} (${predictedPhysics.classification.analogy})
- **Extrapolation Certainty:** ${(predictedPhysics.confidence * 100).toFixed(1)}%
- **Metrics:**
    - Anisotropy (Order): ${predictedPhysics.anisotropy.toFixed(4)}
    - Correlation Length (Interaction): ${predictedPhysics.corr_length.toFixed(1)} px
    - Complexity (Computation): ${predictedPhysics.complexity} iterations

**REQUIRED OUTPUT STRUCTURE:**

### Analysis Log

**1. OBSERVATION:**
- [List 2-3 direct, neutral observations from the data. E.g., "High momentum (~0.9) is combined with moderate novelty (~0.5).", "Predicted anisotropy is high, suggesting significant order."]

**2. INFERENCE:**
- [Interpret what the observations mean. E.g., "The system is in a momentum-dominated regime.", "The high order suggests forces are aligning into a stable, non-random pattern."]

**3. HYPOTHESIS:**
- [State a single, testable hypothesis. E.g., "A stable vortex structure is likely to form here, driven by high momentum and constrained by ordering forces."]

**4. KEY UNCERTAINTIES & RISKS:**
- [**This is the most important section.** List the reasons this analysis could be wrong. Be critical. E.g., "This prediction is a significant extrapolation from the 'flow' data point; the model may not be accurate here.", "The role of 'retention' (not plotted) is unknown in this high-momentum regime and could disrupt vortex formation." ]
`;
    generateContent(prompt);
  }, [activePin, predictedPhysics, realData, generateContent]);
  
  const generateDesign = useCallback(() => {
    if (!designGoal.trim()) {
      setError("Please provide a goal for the experiment.");
      return;
    }
    const prompt = `
You are an expert experimental physicist designing a test for a Salience Field.
The user's goal is: "${designGoal}".

My current location in the parameter space is: Novelty=${activePin?.novelty.toFixed(3)}, Momentum=${activePin?.momentum.toFixed(3)}.

Based on this goal and starting point, design a clear, actionable experimental protocol in markdown.
1.  **Hypothesis:** A testable statement.
2.  **Parameter Trajectory:** Where should I move the probe in the parameter space and why? (e.g., "Increase Novelty while holding Momentum steady.")
3.  **Protocol:** Step-by-step actions.
4.  **Predicted Outcome:** What metrics should change and how?
`;
     generateContent(prompt);
  }, [designGoal, activePin, generateContent]);


  useEffect(() => {
    if (activePin) {
        setMode('analysis');
        generateAnalysis();
    }
  }, [activePin, generateAnalysis]);


  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-400">Thinking...</p>
      </div>;
    }
    if (error) {
      return <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">{error}</div>;
    }
    if (analysis) {
        return <div className="prose prose-sm prose-invert text-gray-300 whitespace-pre-wrap font-sans p-2" style={{fontFamily: 'Inter'}} dangerouslySetInnerHTML={{__html: analysis.replace(/###/g, '<h3 class="text-cyan-400">').replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>') }}></div>
    }
    return <div className="flex items-center justify-center h-full text-center text-gray-600">Select a pin to analyze or design an experiment.</div>;
  }

  return (
    <Card>
        <div className="absolute top-0 left-0 right-0 p-3 border-b border-gray-800 bg-gray-950/30 flex items-center space-x-1 rounded-t-lg z-10">
            <button onClick={() => setMode('analysis')} className={`px-2 py-1 text-xs rounded-md flex items-center space-x-2 ${mode === 'analysis' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                <BrainIcon /> <span>Analysis</span>
            </button>
            <button onClick={() => setMode('design')} className={`px-2 py-1 text-xs rounded-md flex items-center space-x-2 ${mode === 'design' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                <ScienceIcon /> <span>Design</span>
            </button>
        </div>
        <div className="pt-14 h-full overflow-y-auto">
            {mode === 'analysis' && renderContent()}
            {mode === 'design' && (
                <div className="p-2 space-y-3">
                    <textarea
                        value={designGoal}
                        onChange={e => setDesignGoal(e.target.value)}
                        placeholder="e.g., Find the boundary between VORTEX and CRYSTALLINE states"
                        className="w-full bg-gray-950 border-gray-700 rounded-md text-sm p-2"
                        rows={3}
                    />
                    <button onClick={generateDesign} disabled={isLoading} className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md text-sm">Design Experiment</button>
                    <div className="mt-4">{renderContent()}</div>
                </div>
            )}
        </div>
    </Card>
  );
};

export default AICollaborator;
