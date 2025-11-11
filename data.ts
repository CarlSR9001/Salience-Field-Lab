
import { ModeData } from './types';

export const modesData: ModeData[] = [
  {
    "mode": "coupled",
    "anisotropy_a4": 0.9925889046496427,
    "corr_length": 111.0,
    "stats": {
      "render_time_ms": 265.99910000004456,
      "salience_range": [0.0029131772462278605, 0.6042550802230835],
      "avg_components": {"salience": 0.25844937562942505, "novelty": 0.4999493360519409, "retention": 0.3273318409919739, "momentum": 0.5007593035697937},
      "correlations": {"salience_iter": -0.2513530614383541, "salience_magnitude": -0.7227741285950504},
      "iterations_mean": 1.56231689453125,
      "iterations_max": 61
    },
    "ablations": {
      "no_novelty": {"delta_norm": 0.1667441427707672, "anisotropy_a4": 0.9934423913813728, "corr_length": 113.0},
      "no_retention": {"delta_norm": 0.06852570176124573, "anisotropy_a4": 0.9922452862348239, "corr_length": 108.0},
      "no_momentum": {"delta_norm": 0.04764474928379059, "anisotropy_a4": 0.9923966563088866, "corr_length": 112.0},
      "no_decay": {"delta_norm": 0.6426414251327515, "anisotropy_a4": 0.9930983770873562, "corr_length": 103.0}
    }
  },
  {
    "mode": "energy",
    "anisotropy_a4": 0.9868610690164227,
    "corr_length": 84.0,
    "stats": {
      "render_time_ms": 243.03620000137016,
      "salience_range": [0.005151435267180204, 0.5957147479057312],
      "avg_components": {"salience": 0.31915220618247986, "novelty": 0.6633871793746948, "retention": 0.5209685564041138, "momentum": 0.6530663967132568},
      "correlations": {"salience_iter": -0.31200978092880943, "salience_magnitude": -0.15665097231446345},
      "iterations_mean": 1.7164039611816406,
      "iterations_max": 71
    },
    "ablations": {
      "no_novelty": {"delta_norm": 0.16684222221374512, "anisotropy_a4": 0.9820751345879739, "corr_length": 87.0},
      "no_retention": {"delta_norm": 0.10066953301429749, "anisotropy_a4": 0.989498398625496, "corr_length": 84.0},
      "no_momentum": {"delta_norm": 0.06426981091499329, "anisotropy_a4": 0.9870566225622279, "corr_length": 83.0},
      "no_decay": {"delta_norm": 0.5778701901435852, "anisotropy_a4": 0.9962469463589223, "corr_length": 102.0}
    }
  },
  {
    "mode": "flow",
    "anisotropy_a4": 0.9938402085588484,
    "corr_length": 121.0,
    "stats": {
      "render_time_ms": 211.67940000304952,
      "salience_range": [0.003732269164174795, 0.6226322054862976],
      "avg_components": {"salience": 0.22494393587112427, "novelty": 0.4406806230545044, "retention": 0.5559410452842712, "momentum": 0.9238691329956055},
      "correlations": {"salience_iter": -0.22199918347603015, "salience_magnitude": -0.8599335165815456},
      "iterations_mean": 1.463958740234375,
      "iterations_max": 51
    },
    "ablations": {
      "no_novelty": {"delta_norm": 0.145358145236969, "anisotropy_a4": 0.9930045711217744, "corr_length": 114.0},
      "no_retention": {"delta_norm": 0.0942683219909668, "anisotropy_a4": 0.9940141087497645, "corr_length": 121.0},
      "no_momentum": {"delta_norm": 0.0749436616897583, "anisotropy_a4": 0.9930871621923308, "corr_length": 122.0},
      "no_decay": {"delta_norm": 0.5215885639190674, "anisotropy_a4": 0.996947785559161, "corr_length": 121.0}
    }
  },
  {
    "mode": "phase",
    "anisotropy_a4": 0.994984649666489,
    "corr_length": 93.0,
    "stats": {
      "render_time_ms": 245.15160000009928,
      "salience_range": [0.004760846961289644, 0.6635914444923401],
      "avg_components": {"salience": 0.4354321360588074, "novelty": 0.8290277719497681, "retention": 0.6358557939529419, "momentum": 0.4994901120662689},
      "correlations": {"salience_iter": -0.3746861903842073, "salience_magnitude": -0.31921232419709755},
      "iterations_mean": 2.0226898193359375,
      "iterations_max": 160
    },
    "ablations": {
      "no_novelty": {"delta_norm": 0.20124979317188263, "anisotropy_a4": 0.9933680698572104, "corr_length": 91.0},
      "no_retention": {"delta_norm": 0.08245011419057846, "anisotropy_a4": 0.9952404111708711, "corr_length": 91.0},
      "no_momentum": {"delta_norm": 0.043085627257823944, "anisotropy_a4": 0.9951941277725267, "corr_length": 94.0},
      "no_decay": {"delta_norm": 0.5758922100067139, "anisotropy_a4": 0.9996265474924149, "corr_length": 256.0}
    }
  }
];