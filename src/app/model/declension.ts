export class Declension {
    singular: DeclensionForm = new DeclensionForm();
    plural: DeclensionForm = new DeclensionForm();
}

export class DeclensionForm {
    nominative: string[] = [];
    genitive: string[] = [];
    partitive: string[] = [];
    nominativeAccusative: string[] = [];
    genitiveAccusative: string[] = [];
    inessive: string[] = [];
    elative: string[] = [];
    illative: string[] = [];
    adessive: string[] = [];
    ablative: string[] = [];
    allative: string[] = [];
    essive: string[] = [];
    translative: string[] = [];
    instructive: string[] = [];
    abessive: string[] = [];
    comitative: string[] = [];
}

export class DeclensionString {
    singular: DeclensionFormString = new DeclensionFormString();
    plural: DeclensionFormString = new DeclensionFormString();
}

export class DeclensionFormString {
    nominative: string = null;
    genitive: string = null;
    partitive: string = null;
    nominativeAccusative: string = null;
    genitiveAccusative: string = null;
    inessive: string = null;
    elative: string = null;
    illative: string = null;
    adessive: string = null;
    ablative: string = null;
    allative: string = null;
    essive: string = null;
    translative: string = null;
    instructive: string = null;
    abessive: string = null;
    comitative: string = null;
}