export class Declesion {
    singular: DeclesionForm = new DeclesionForm();
    plural: DeclesionForm = new DeclesionForm();
}

export class DeclesionForm {
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

export class DeclesionString {
    singular: DeclesionFormString = new DeclesionFormString();
    plural: DeclesionFormString = new DeclesionFormString();
}

export class DeclesionFormString {
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