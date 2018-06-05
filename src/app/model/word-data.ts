export interface WordData {
    id: number;
    word: string;
}

export class FiWordData implements WordData {
    id: number;
    word: string;
    types: FiWordType[];
}

export class FiVerbData extends FiWordData {
}

export class FiNominalData extends FiWordData {
    vowelHarmony: string[];
}

export class FiWordType {
    type: number;
    gradation: string;
}

export class WordDataContainer {
    fiNominalData?: FiNominalData;
    fiVerbData?: FiVerbData;
}