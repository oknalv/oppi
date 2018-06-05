export class FiVerbMetadata {
    types: string;
    type: string;
    gradation: string;
    gradationTypes: object;
}

export class FiNominalMetadata extends FiVerbMetadata{
    vowelHarmony: string;
    vowelHarmonyTypes: object = {0: [], 1: []};
}