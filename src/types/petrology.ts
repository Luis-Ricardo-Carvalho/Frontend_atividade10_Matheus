export interface ChemicalOxides {
  SiO2n: number;
  TiO2n: number;
  Al2O3n: number;
  'FeO*n': number;
  MnOn: number;
  MgOn: number;
  CaOn: number;
  Na2On: number;
  K2On: number;
  P2O5n: number;
}

export interface PredictionPayload extends ChemicalOxides {
  // Compatible plain keys for APIs accepting without trailing 'n'
  SiO2?: number;
  TiO2?: number;
  Al2O3?: number;
  FeO?: number;
  MnO?: number;
  MgO?: number;
  CaO?: number;
  Na2O?: number;
  K2O?: number;
  P2O5?: number;
}

export interface PredictionResponse {
  codigo?: number;
  confianca?: number;
  predicao: string;
  probabilidades?: Record<string, number>;
  dados_recebidos?: Record<string, number>;
  mensagem?: string;
  erro?: string;
}

export interface OxideFieldDefinition {
  key: keyof ChemicalOxides;
  plainKey: string;
  formula: string;
  formulaHtml: string;
  name: string;
  namePt: string;
  typicalMin: number;
  typicalMax: number;
  step: number;
  category: 'felsic' | 'mafic' | 'calcic' | 'accessory';
  description: string;
}

export const OXIDE_DEFINITIONS: OxideFieldDefinition[] = [
  {
    key: 'SiO2n',
    plainKey: 'SiO2',
    formula: 'SiO2',
    formulaHtml: 'SiO₂',
    name: 'Silicon Dioxide',
    namePt: 'Dióxido de Silício',
    typicalMin: 40.0,
    typicalMax: 78.0,
    step: 0.1,
    category: 'felsic',
    description: 'Componente principal que define a acidez da rocha (básica < 52% vs ácida > 63%).'
  },
  {
    key: 'TiO2n',
    plainKey: 'TiO2',
    formula: 'TiO2',
    formulaHtml: 'TiO₂',
    name: 'Titanium Dioxide',
    namePt: 'Dióxido de Titânio',
    typicalMin: 0.1,
    typicalMax: 3.5,
    step: 0.05,
    category: 'accessory',
    description: 'Comum em ilmenita e rutilo; abundante em magmas máficos a intermediários.'
  },
  {
    key: 'Al2O3n',
    plainKey: 'Al2O3',
    formula: 'Al2O3',
    formulaHtml: 'Al₂O₃',
    name: 'Aluminum Oxide',
    namePt: 'Óxido de Alumínio',
    typicalMin: 10.0,
    typicalMax: 22.0,
    step: 0.1,
    category: 'felsic',
    description: 'Constituinte chave dos feldspatos (plagioclásio e feldspato alcalino).'
  },
  {
    key: 'FeO*n',
    plainKey: 'FeO',
    formula: 'FeO*',
    formulaHtml: 'FeO*',
    name: 'Total Iron Oxide',
    namePt: 'Óxido de Ferro Total',
    typicalMin: 0.5,
    typicalMax: 15.0,
    step: 0.1,
    category: 'mafic',
    description: 'Ferro total expresso como FeO; característico de minerais máficos e olivinas.'
  },
  {
    key: 'MnOn',
    plainKey: 'MnO',
    formula: 'MnO',
    formulaHtml: 'MnO',
    name: 'Manganese Oxide',
    namePt: 'Óxido de Manganês',
    typicalMin: 0.02,
    typicalMax: 0.5,
    step: 0.01,
    category: 'accessory',
    description: 'Óxido menor presente em substituição ao Fe²⁺ e Mg²⁺ em minerais máficos.'
  },
  {
    key: 'MgOn',
    plainKey: 'MgO',
    formula: 'MgO',
    formulaHtml: 'MgO',
    name: 'Magnesium Oxide',
    namePt: 'Óxido de Magnésio',
    typicalMin: 0.2,
    typicalMax: 15.0,
    step: 0.1,
    category: 'mafic',
    description: 'Indicador de enriquecimento primitivo em olivina e piroxênio (máfico/ultramáfico).'
  },
  {
    key: 'CaOn',
    plainKey: 'CaO',
    formula: 'CaO',
    formulaHtml: 'CaO',
    name: 'Calcium Oxide',
    namePt: 'Óxido de Cálcio',
    typicalMin: 0.5,
    typicalMax: 14.0,
    step: 0.1,
    category: 'calcic',
    description: 'Presente no plagioclásio cálcico (anortita) e clinopiroxênios.'
  },
  {
    key: 'Na2On',
    plainKey: 'Na2O',
    formula: 'Na2O',
    formulaHtml: 'Na₂O',
    name: 'Sodium Oxide',
    namePt: 'Óxido de Sódio',
    typicalMin: 1.0,
    typicalMax: 6.0,
    step: 0.05,
    category: 'felsic',
    description: 'Álcali essencial no plagioclásio sódico (albita) e feldspatos alcalinos.'
  },
  {
    key: 'K2On',
    plainKey: 'K2O',
    formula: 'K2O',
    formulaHtml: 'K₂O',
    name: 'Potassium Oxide',
    namePt: 'Óxido de Potássio',
    typicalMin: 0.2,
    typicalMax: 6.5,
    step: 0.05,
    category: 'felsic',
    description: 'Álcali característico de rochas diferenciadas (riolitos, granitos, ortoclásio).'
  },
  {
    key: 'P2O5n',
    plainKey: 'P2O5',
    formula: 'P2O5',
    formulaHtml: 'P₂O₅',
    name: 'Phosphorus Pentoxide',
    namePt: 'Pentóxido de Fósforo',
    typicalMin: 0.02,
    typicalMax: 1.2,
    step: 0.01,
    category: 'accessory',
    description: 'Mineral acessório típico da apatita petrogênica.'
  }
];

export interface RockPreset {
  id: string;
  name: string;
  namePt: string;
  expectedClass: string;
  description: string;
  values: ChemicalOxides;
}

export const ROCK_PRESETS: RockPreset[] = [
  {
    id: 'basalt-assignment',
    name: 'Basalt (Exemplo da Tarefa)',
    namePt: 'Basalto (Amostra Padrão)',
    expectedClass: 'Basalt',
    description: 'Amostra modelo da atividade: máfica, baixo SiO2 (47.77%) e rica em FeO* e MgO.',
    values: {
      SiO2n: 47.77,
      TiO2n: 1.33,
      Al2O3n: 15.38,
      'FeO*n': 9.59,
      MnOn: 0.17,
      MgOn: 10.76,
      CaOn: 11.28,
      Na2On: 2.69,
      K2On: 0.62,
      P2O5n: 0.41
    }
  },
  {
    id: 'andesite-sample',
    name: 'Andesite',
    namePt: 'Andesito Vulcânico',
    expectedClass: 'Andesite',
    description: 'Rocha ígnea intermediária (57.94% SiO2) típica de zonas de subducção e arcos vulcânicos.',
    values: {
      SiO2n: 57.94,
      TiO2n: 0.87,
      Al2O3n: 17.02,
      'FeO*n': 6.55,
      MnOn: 0.14,
      MgOn: 3.34,
      CaOn: 6.78,
      Na2On: 3.68,
      K2On: 1.62,
      P2O5n: 0.21
    }
  },
  {
    id: 'basaltic-andesite',
    name: 'Basaltic Andesite',
    namePt: 'Andesito Basáltico',
    expectedClass: 'Basaltic andesite',
    description: 'Transição entre basalto e andesito (53.5% SiO2), moderadamente máfica.',
    values: {
      SiO2n: 53.50,
      TiO2n: 1.10,
      Al2O3n: 16.20,
      'FeO*n': 8.10,
      MnOn: 0.15,
      MgOn: 6.20,
      CaOn: 8.90,
      Na2On: 3.20,
      K2On: 1.10,
      P2O5n: 0.25
    }
  },
  {
    id: 'dacite-sample',
    name: 'Dacite',
    namePt: 'Dacito',
    expectedClass: 'Dacite',
    description: 'Rocha ígnea félsica com sílica intermediária a alta (66.2% SiO2) e rica em quartzo/plagioclásio.',
    values: {
      SiO2n: 66.20,
      TiO2n: 0.55,
      Al2O3n: 15.60,
      'FeO*n': 4.20,
      MnOn: 0.08,
      MgOn: 1.80,
      CaOn: 3.90,
      Na2On: 4.10,
      K2On: 2.80,
      P2O5n: 0.15
    }
  },
  {
    id: 'rhyolite-sample',
    name: 'Rhyolite',
    namePt: 'Riolito Félsico',
    expectedClass: 'Rhyolite',
    description: 'Rocha vulcânica ácida com alto teor de sílica (73.66% SiO2) e álcalis, equivalente ao granito.',
    values: {
      SiO2n: 73.66,
      TiO2n: 0.22,
      Al2O3n: 13.45,
      'FeO*n': 2.05,
      MnOn: 0.05,
      MgOn: 0.38,
      CaOn: 1.12,
      Na2On: 3.99,
      K2On: 4.85,
      P2O5n: 0.07
    }
  }
];

export interface HistoryRecord {
  id: string;
  timestamp: string;
  oxides: ChemicalOxides;
  prediction: string;
  confidence?: number;
  codigo?: number;
}
