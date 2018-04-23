export class FiDeclensionWordInfo {
    id: number;
    word: string;
    types: FiDeclensionType[];
    vowelHarmony: string[];
}

export class FiDeclensionType {
    type: number;
    gradation: string;
}