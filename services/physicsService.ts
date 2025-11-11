import { ModeData, ClassificationResult, PredictedPhysics, AblationImpact } from '../types';

export const classifyPattern = (modeData: ModeData): ClassificationResult => {
    const { stats, anisotropy_a4, corr_length } = modeData;
    const { iterations_mean, iterations_max, avg_components } = stats;
    const { novelty, momentum } = avg_components;

    if (iterations_mean < 1.6 && anisotropy_a4 > 0.985 && corr_length > 80 && corr_length < 120) {
        return { pattern: "CRYSTALLINE", analogy: "Spontaneous symmetry breaking" };
    }
    if (momentum > 0.8 && novelty > 0.4 && anisotropy_a4 > 0.99) {
        return { pattern: "VORTEX", analogy: "Topological defect with winding number" };
    }
    if (iterations_max > 150 && novelty > 0.8) {
        return { pattern: "TURBULENT", analogy: "Chaotic dynamics at a critical point" };
    }
    if (momentum > 0.4 && momentum < 0.6 && novelty > 0.4 && novelty < 0.6) {
        return { pattern: "PHASE_BOUNDARY", analogy: "Coexistence of two phases" };
    }
    if (corr_length < 90 && iterations_mean > 1.7) {
        return { pattern: "NUCLEATION", analogy: "Bubble formation in a metastable vacuum" };
    }
    return { pattern: "MIXED", analogy: "Complex multi-phase dynamics" };
};

export const predictPhysicsForParams = (novelty: number, momentum: number, allModes: ModeData[]): PredictedPhysics => {
    let closestMode: ModeData | null = null;
    let minDistance = Infinity;

    for (const mode of allModes) {
        const dist = Math.sqrt(
            Math.pow(novelty - mode.stats.avg_components.novelty, 2) +
            Math.pow(momentum - mode.stats.avg_components.momentum, 2)
        );
        if (dist < minDistance) {
            minDistance = dist;
            closestMode = mode;
        }
    }

    if (!closestMode) {
        return {
            classification: { pattern: "UNKNOWN", analogy: "Parameter space is unexplored" },
            anisotropy: 0,
            corr_length: 0,
            complexity: 0,
            confidence: 0
        };
    }

    // A more complex model could use multiple neighbors (e.g., k-NN)
    const weight = Math.exp(-minDistance * 4); // Confidence decays exponentially with distance

    const predictedAnisotropy = closestMode.anisotropy_a4;
    const predictedCorrLength = closestMode.corr_length;
    const predictedComplexity = closestMode.stats.iterations_max;
    
    return {
        classification: classifyPattern(closestMode),
        anisotropy: predictedAnisotropy,
        corr_length: predictedCorrLength,
        complexity: predictedComplexity,
        confidence: weight,
    };
};

export const calculateAblationImpacts = (modeData: ModeData): AblationImpact[] => {
    const base = {
        anisotropy: modeData.anisotropy_a4,
        corr_length: modeData.corr_length,
    };

    const impacts: AblationImpact[] = [];

    const ablationKeys = Object.keys(modeData.ablations) as Array<keyof typeof modeData.ablations>;

    ablationKeys.forEach(key => {
        const ablation = modeData.ablations[key];
        const name = key.replace('no_', '').charAt(0).toUpperCase() + key.replace('no_', '').slice(1);
        
        impacts.push({
            name: name as AblationImpact['name'],
            delta_norm_impact: ablation.delta_norm, // This is already a delta
            anisotropy_impact: ((ablation.anisotropy_a4 - base.anisotropy) / base.anisotropy) * 100,
            corr_length_impact: ((ablation.corr_length - base.corr_length) / base.corr_length) * 100,
        });
    });

    return impacts;
}
