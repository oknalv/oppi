export class FiDeclensionErrors {
    numberOfErrors: number = 0;
    singular: FiDeclensionErrorForm = new FiDeclensionErrorForm();
    plural: FiDeclensionErrorForm = new FiDeclensionErrorForm();
}

export class FiDeclensionErrorForm {
    nominative: boolean = null;
    genitive: boolean = null;
    partitive: boolean = null;
    nominativeAccusative: boolean = null;
    genitiveAccusative: boolean = null;
    inessive: boolean = null;
    elative: boolean = null;
    illative: boolean = null;
    adessive: boolean = null;
    ablative: boolean = null;
    allative: boolean = null;
    essive: boolean = null;
    translative: boolean = null;
    instructive: boolean = null;
    abessive: boolean = null;
    comitative: boolean = null;
}