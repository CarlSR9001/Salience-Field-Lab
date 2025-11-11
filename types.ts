export interface AblationData {
  delta_norm: number;
  anisotropy_a4: number;
  corr_length: number;
}

export interface Ablations {
  no_novelty: AblationData;
  no_retention: AblationData;
  no_momentum: AblationData;
  no_decay: AblationData;
}

export interface Stats {
  render_time_ms: number;
  salience_range: [number, number];
  avg_components: {
    salience: number;
    novelty: number;
    retention: number;
    momentum: number;
  };
  correlations: {
    salience_iter: number;
    salience_magnitude: number;
  };
  iterations_mean: number;
  iterations_max: number;
}

export interface ModeData {
  mode: string;
  anisotropy_a4: number;
  corr_length: number;
  stats: Stats;
  ablations: Ablations;
}

export interface ClassificationResult {
  pattern: string;
  analogy: string;
}

export interface PredictedPhysics {
  classification: ClassificationResult;
  anisotropy: number;
  corr_length: number;
  complexity: number; // Max iterations
  confidence: number;
}

export interface ProbeState {
  novelty: number;
  momentum: number;
}

export interface PinState extends ProbeState {
  id: string;
  isReal: boolean;
  modeName?: string;
  type?: 'virtual' | 'real';
}

export interface AblationImpact {
    name: 'Novelty' | 'Retention' | 'Momentum' | 'Decay';
    delta_norm_impact: number;
    anisotropy_impact: number;
    corr_length_impact: number;
}
