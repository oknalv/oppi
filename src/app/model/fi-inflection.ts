export class FiDeclension {
    singular: FiDeclensionForm = new FiDeclensionForm();
    plural: FiDeclensionForm = new FiDeclensionForm();
}

export class FiDeclensionForm {
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

export class FiDeclensionString {
    singular: FiDeclensionFormString = new FiDeclensionFormString();
    plural: FiDeclensionFormString = new FiDeclensionFormString();
}

export class FiDeclensionFormString {
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

export class FiConjugation {
    moods: FiMoods = new FiMoods();
    nominalForms: FiConjugationNominalForms = new FiConjugationNominalForms();
}

export class FiMoods {
    indicative: FiIndicative = new FiIndicative();
    conditional: FiNoIndicative = new FiNoIndicative();
    imperative: FiNoIndicative = new FiNoIndicative();
    potential: FiNoIndicative = new FiNoIndicative();
}

export class FiNoIndicative {
    present: FiTense = new FiTense();
}

export class FiIndicative extends FiNoIndicative {
    past: FiTense = new FiTense();
}

export class FiTense {
    singular1: string[] = [];
    singular2: string[] = [];
    singular3: string[] = [];
    plural1: string[] = [];
    plural2: string[] = [];
    plural3: string[] = [];
    passive: string[] = [];
    negative1: string[] = [];
    negative2: string[] = [];
    passiveNegative: string[] = []; 
}

export class FiConjugationNominalForms {
    infinitives: FiInfinitives = new FiInfinitives();
    participles: FiParticiples = new FiParticiples();
}

export class FiInfinitives {
    first: string[] = [];
    firstLong: string[] = [];
    secondInessiveActive: string[] = [];
    secondInessivePassive: string[] = [];
    secondInstructive: string[] = [];
    thirdInessive: string[] = [];
    thirdElative: string[] = [];
    thirdIllative: string[] = [];
    thirdAdessive: string[] = [];
    thirdAbessive: string[] = [];
    thirdInstructiveActive: string[] = [];
    thirdInstructivePassive: string[] = [];
    fourthNominative: string[] = [];
    fourthPartitive: string[] = [];
    fifth: string[] = [];
}

export class FiParticiples{
    presentActive: string[] = [];
    presentPassive: string[] = [];
    pastActive: string[] = [];
    pastPassive: string[] = [];
    agent: string[] = [];
    negative: string[] = [];
}

export class FiConjugationString {
    moods: FiMoodsString = new FiMoodsString();
    nominalForms: FiConjugationNominalFormsString = new FiConjugationNominalFormsString();
}

export class FiMoodsString {
    indicative: FiIndicativeString = new FiIndicativeString();
    conditional: FiNoIndicativeString = new FiNoIndicativeString();
    imperative: FiNoIndicativeString = new FiNoIndicativeString();
    potential: FiNoIndicativeString = new FiNoIndicativeString();
}

export class FiNoIndicativeString {
    present: FiTenseString = new FiTenseString();
    perfect: FiTenseString = new FiTenseString();
}

export class FiIndicativeString extends FiNoIndicativeString {
    past: FiTenseString = new FiTenseString();
    pluperfect: FiTenseString = new FiTenseString();
}

export class FiTenseString {
    singular1: string = null;
    singular2: string = null;
    singular3: string = null;
    plural1: string = null;
    plural2: string = null;
    plural3: string = null;
    passive: string = null;
    negative1: string = null;
    negative2: string = null;
    negative3: string = null;
    negative4: string = null;
    negative5: string = null;
    negative6: string = null;
    passiveNegative: string = null;
}

export class FiConjugationNominalFormsString {
    infinitives: FiInfinitivesString = new FiInfinitivesString();
    participles: FiParticiplesString = new FiParticiplesString();
}

export class FiInfinitivesString {
    first: string = null;
    firstLong: string = null;
    secondInessiveActive: string = null;
    secondInessivePassive: string = null;
    secondInstructive: string = null;
    thirdInessive: string = null;
    thirdElative: string = null;
    thirdIllative: string = null;
    thirdAdessive: string = null;
    thirdAbessive: string = null;
    thirdInstructiveActive: string = null;
    thirdInstructivePassive: string = null;
    fourthNominative: string = null;
    fourthPartitive: string = null;
    fifth: string = null;
}

export class FiParticiplesString{
    presentActive: string = null;
    presentPassive: string = null;
    pastActive: string = null;
    pastPassive: string = null;
    agent: string = null;
    negative: string = null;
}

export class FiConjugationErrors {
    numberOfErrors: number = 0;
    moods: FiMoodsErrors = new FiMoodsErrors();
    nominalForms: FiConjugationNominalFormsErrors = new FiConjugationNominalFormsErrors();
}

export class FiMoodsErrors {
    indicative: FiIndicativeErrors = new FiIndicativeErrors();
    conditional: FiNoIndicativeErrors = new FiNoIndicativeErrors();
    imperative: FiNoIndicativeErrors = new FiNoIndicativeErrors();
    potential: FiNoIndicativeErrors = new FiNoIndicativeErrors();
}

export class FiNoIndicativeErrors {
    present: FiTenseErrors = new FiTenseErrors();
    perfect: FiTenseErrors = new FiTenseErrors();
}

export class FiIndicativeErrors extends FiNoIndicativeErrors {
    past: FiTenseErrors = new FiTenseErrors();
    pluperfect: FiTenseErrors = new FiTenseErrors();
}

export class FiTenseErrors {
    singular1: boolean = null;
    singular2: boolean = null;
    singular3: boolean = null;
    plural1: boolean = null;
    plural2: boolean = null;
    plural3: boolean = null;
    passive: boolean = null;
    negative1: boolean = null;
    negative2: boolean = null;
    negative3: boolean = null;
    negative4: boolean = null;
    negative5: boolean = null;
    negative6: boolean = null;
    passiveNegative: boolean = null;
}

export class FiConjugationNominalFormsErrors {
    infinitives: FiInfinitivesErrors = new FiInfinitivesErrors();
    participles: FiParticiplesErrors = new FiParticiplesErrors();
}

export class FiInfinitivesErrors {
    first: boolean = null;
    firstLong: boolean = null;
    secondInessiveActive: boolean = null;
    secondInessivePassive: boolean = null;
    secondInstructive: boolean = null;
    thirdInessive: boolean = null;
    thirdElative: boolean = null;
    thirdIllative: boolean = null;
    thirdAdessive: boolean = null;
    thirdAbessive: boolean = null;
    thirdInstructiveActive: boolean = null;
    thirdInstructivePassive: boolean = null;
    fourthNominative: boolean = null;
    fourthPartitive: boolean = null;
    fifth: boolean = null;
}

export class FiParticiplesErrors{
    presentActive: boolean = null;
    presentPassive: boolean = null;
    pastActive: boolean = null;
    pastPassive: boolean = null;
    agent: boolean = null;
    negative: boolean = null;
}