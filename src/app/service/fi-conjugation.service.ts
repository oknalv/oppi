import { Injectable } from '@angular/core';
import { FiInflectionService, InvalidWordDataError } from './fi-inflection.service';
import { FiVerbData, FiWordType } from '../model/word-data';
import { FiConjugation } from '../model/fi-inflection';

/**
 * The service which conjugates Finnish verbs.
 */
@Injectable()
export class FiConjugationService extends FiInflectionService<FiVerbData, FiConjugation>{

  constructor(){
      super();
  }

  /**
   * Declines a Finnish nominal using the `fiNominalData` param.
   * 
   * @param fiNominalData A FiNominalData that contains the data which this method needs to decline a nominal.
   * @returns The declension of the finnish nominal given in `fiNominalData`.
   */
  inflect(fiVerbData: FiVerbData): FiConjugation[] {
    try{
      let verb: string = fiVerbData.word;
      let fiConjugations: FiConjugation[] = [];
      let wordTypes: FiWordType[] = fiVerbData.types;
      let a: string = this.getLastN(verb, 1);
      let u: string = a == 'a' ? 'u' : 'y';
      let o: string = a == 'a' ? 'o' : 'ö';
      wordTypes.sort((a: FiWordType, b: FiWordType): number => a.type - b.type);
      for(let type of wordTypes){
        let wordType: number = type.type;
        // If it is of type 55, it splits to type 53 and 54
        if(wordType == 55){
          let type53 = new FiWordType();
          type53.type = 53;
          type53.gradation = type.gradation;
          if(!wordTypes.includes(type53)){
            wordTypes.push(type53);
          }
          let type54 = new FiWordType();
          type54.type = 54;
          type54.gradation = type.gradation;
          if(!wordTypes.includes(type54)){
            wordTypes.push(type54);
          }
          continue;
        }
        // If it is of type 57, it splits to type 54 and 56
        if(wordType == 57){
          let type54 = new FiWordType();
          type54.type = 54;
          type54.gradation = type.gradation;
          if(!wordTypes.includes(type54)){
            wordTypes.push(type54);
          }
          let type56 = new FiWordType();
          type56.type = 56;
          type56.gradation = type.gradation;
          if(!wordTypes.includes(type56)){
            wordTypes.push(type56);
          }
          continue;
        }
        let wordGradation: string = type.gradation;
        let fiConjugation: FiConjugation = new FiConjugation();
        let strongStem: string = this.getStrongStem(verb, wordType, wordGradation);
        let weakStem: string = this.getWeakStem(verb, strongStem, wordType, wordGradation);
        let passiveWeakStem: string = this.getPassiveWeakStem(weakStem, wordType);
        let participlePastActiveStems: string[] = this.getParticiplePastActiveStems(verb, strongStem, weakStem, wordType);
        this.conjugateMoods(verb, strongStem, weakStem, participlePastActiveStems, a, o, u, wordType, fiConjugation);
        this.conjugateNominalForms(verb, strongStem, participlePastActiveStems, a, o, u, wordType, fiConjugation);
        this.conjugatePassives(verb, passiveWeakStem, a, o, u, wordType, fiConjugation);
        fiConjugations.push(fiConjugation);
      }
      return fiConjugations;
    } catch(e){
      throw new InvalidWordDataError(fiVerbData);
    }
  }

  //Gets the strong stem of the verb.
  /**
   * 
   * @param verb The verb.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param wordGradation The gradation type.
   * @returns The strong stem.
   */
  private getStrongStem(verb: string, wordType: number, wordGradation: string): string {
    if([73, 74, 75].includes(wordType)){
      return this.removeLastN(this.inverseGradate(verb, wordType, wordGradation), 2) + this.getLastN(verb, 1);
    }
    if(wordType == 72){
      return this.removeLastN(this.inverseGradate(verb, wordType, wordGradation), 2) + 'ne';
    }
    if(wordType == 71){
      return this.removeLastN(verb, 3) + 'ke';
    }
    if(wordType == 70){
      return this.removeLastN(verb, 3) + 'kse';
    }
    if(wordType == 69){
      return this.removeLastN(verb, 1) + 'se';
    }
    if([62, 63, 64, 65, 68].includes(wordType)){
      return this.removeLastN(verb, 2);
    }
    if([66, 67].includes(wordType)){
      return this.removeLastN(this.inverseGradate(verb, wordType, wordGradation), 2) + 'e';
    }
    return this.removeLastN(verb, 1);
  }

  /**
   * Gets the weak stem of the verb.
   * 
   * @param verb The verb.
   * @param strongStem The strong stem of the verb.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param wordGradation The gradation type.
   * @returns The weak stem.
   */
  private getWeakStem(verb: string, strongStem: string, wordType: number, wordGradation: string): string {
    if([73, 74, 75].includes(wordType)){
      return this.removeLastN(verb, 2) + this.getLastN(verb, 1);
    }
    if(wordType == 72){
      return this.removeLastN(verb, 2) + 'ne';
    }
    if(wordType == 71){
      return this.removeLastN(verb, 3) + 'e';
    }
    if([66, 67].includes(wordType)){
      return this.removeLastN(verb, 2) + 'e';
    }
    if([52, 53, 54, 56, 58, 59, 60, 61, 76].includes(wordType)){ //55 included in 53 and 54, 57 included in 54 and 56
      return this.removeLastN(this.gradate(verb, wordGradation), 1);
    }
    return strongStem;
  }

  /**
   * Gets the passive weak stem of the verb.
   * 
   * @param weakStem The weak stem of the verb.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The passive weak stem.
   */
  private getPassiveWeakStem(weakStem: string, wordType: number): string {
    if(wordType == 72){
      return this.removeLastN(weakStem, 2);
    }
    if(wordType == 71){
      return this.removeLastN(weakStem, 1) + 'h';
    }
    if(wordType == 70){
      return this.removeLastN(weakStem, 3) + 's';
    }
    if(wordType == 69){
      return this.removeLastN(weakStem, 3);
    }
    if([53, 54, 56, 76].includes(wordType)){ //55 included in 53 and 54, 57 included in 54 and 56
      return this.removeLastN(weakStem, 1) + 'e';
    }
    if([66, 67, 73, 74, 75].includes(wordType)){
      return this.removeLastN(weakStem, 1);
    }
    return weakStem;
  }

  /**
   * Gets the participle past active stems.
   * 
   * @param verb The verb.
   * @param strongStem The strong stem of the verb.
   * @param weakStem The weak stem of the verb.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @return An array containing the participle past active stems.
   */
  private getParticiplePastActiveStems(verb: string, strongStem: string, weakStem: string, wordType: number): string[] {
    //initial stems
    let stems: string[] = [];
    if(wordType == 66){
      stems.push(this.removeLastN(weakStem, 1) + 's');
    }
    else if(wordType == 67){
      stems.push(this.removeLastN(verb, 1));
    }
    else if(wordType == 70){
      stems.push(this.removeLastN(weakStem, 3) + 'ss');
    }
    else if([69, 72, 73, 74, 75].includes(wordType)){
      stems.push(this.removeLastN(verb, 2) + 'nn');
    }
    else if(wordType == 71) {
      stems.push(this.removeLastN(verb, 2) + 'n');
    }
    else {
      stems.push(strongStem + 'n');
    }
    //additional stems
    if(wordType == 76){
      stems.push(this.removeLastN(verb, 3) + 'nn');
    }
    return stems;
  }

  /**
   * Gradates the verb.
   * 
   * @param verb The verb.
   * @param wordGradation The gradation type.
   * @returns The gradated verb.
   */
  private gradate(verb: string, wordGradation): string {
    let verbBeginning: string = this.removeLastN(verb, 2);
    let verbEnd: string = this.getLastN(verb, 2);
    return this.gradateWordBeginning(verbBeginning, wordGradation) + verbEnd;
  }

  /**
   * Inverse gradates the verb.
   * 
   * @param verb The verb.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param wordGradation The gradation type.
   * @returns The inverse gradated verb.
   */
  private inverseGradate(verb: string, wordType: number, wordGradation: string): string {
    let splitNumber: number = [72, 73, 74, 75].includes(wordType) ? 3 : 4;
    let verbBeginning: string = this.removeLastN(verb, splitNumber);
    let verbEnd: string = this.getLastN(verb, splitNumber);
    return this.inverseGradateWordBeginning(verbBeginning, wordGradation) + verbEnd;
  }

  /**
   * Conjugates the moods of the verb.
   * 
   * @param verb The verb
   * @param strongStem The strong stem of the verb.
   * @param weakStem The weak stem of the verb.
   * @param participlePastActiveStems The stem from the participle past active.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param u The 'u' or 'y' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateMoods(verb: string, strongStem: string, weakStem: string, participlePastActiveStems: string[],
      a: string, o: string, u: string, wordType: number, fiConjugation: FiConjugation): void {
    this.conjugateIndicative(strongStem, weakStem, participlePastActiveStems, a, u, wordType, fiConjugation);
    this.conjugateConditional(strongStem, a, wordType, fiConjugation);
    this.conjugateImperative(verb, strongStem, weakStem, a, o, wordType, fiConjugation);
    this.conjugatePotential(participlePastActiveStems, a, fiConjugation);
  }

  /**
   * Conjugates the indicative mood tenses.
   * 
   * @param strongStem The strong stem of the verb.
   * @param weakStem The weak stem of the verb.
   * @param participlePastActiveStems The stem from the participle past active.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param u The 'u' or 'y' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateIndicative(strongStem: string, weakStem: string, participlePastActiveStems: string[],
      a: string, u: string, wordType: number, fiConjugation: FiConjugation): void {
    this.conjugateIndicativePresent(strongStem, weakStem, a, wordType, fiConjugation);
    this.conjugateIndicativePast(strongStem, weakStem, participlePastActiveStems, a, u, wordType, fiConjugation);
  }

  /**
   * Conjugates the indicative present tense.
   * 
   * @param strongStem The strong stem of the verb.
   * @param weakStem The weak stem of the verb.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateIndicativePresent(strongStem: string, weakStem: string, a: string, wordType: number, fiConjugation: FiConjugation): void {
    //initial stems
    let weakStems: string[] = [66, 67, 72, 73, 74, 75].includes(wordType) ? [strongStem] : [weakStem];
    let strongStems: string[] = [strongStem];
    let singular3: string[] = [62, 63, 64, 65, 68, 73].includes(wordType) ? [strongStem] : [strongStem + this.getLastN(strongStem, 1)];
    //additional stems
    if(wordType == 68){
      weakStems.push(weakStems[0] + 'tse');
      strongStems = weakStems;
      singular3.push(singular3[0] + 'tsee');
    }
    fiConjugation.moods.indicative.present.singular1 = this.concatEndToStems(weakStems , 'n');
    fiConjugation.moods.indicative.present.singular2 = this.concatEndToStems(weakStems, 't');
    fiConjugation.moods.indicative.present.singular3 = singular3;
    fiConjugation.moods.indicative.present.plural1 = this.concatEndToStems(weakStems, 'mme');
    fiConjugation.moods.indicative.present.plural2 = this.concatEndToStems(weakStems, 'tte');
    fiConjugation.moods.indicative.present.plural3 = this.concatEndToStems(strongStems, 'v' + a + 't');
    fiConjugation.moods.indicative.present.negative1 = weakStems;
  }

  /**
   * Conjugates the indicative past tense.
   * 
   * @param strongStem The strong stem of the verb.
   * @param weakStem The weak stem of the verb.
   * @param participlePastActiveStems The stem from the participle past active, used in the negative forms.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param u The 'u' or 'y' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateIndicativePast(strongStem: string, weakStem: string, participlePastActiveStems: string[],
      a: string, u: string, wordType: number, fiConjugation: FiConjugation): void {
    //initial stems
    let strongStems: string[] = [strongStem];
    let weakStems: string[] = [weakStem];
    if([73, 74, 75].includes(wordType)){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 1) + 's');
      weakStems = strongStems;
    }
    if([66, 67, 69, 70, 72].includes(wordType)){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 1));
      weakStems = strongStems;
    }
    if(wordType == 65){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 1) + 'v');
      weakStems = strongStems;
    }
    if(wordType == 64){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 2) + this.getLastN(stem,1));
      weakStems = strongStems;
    }
    if([53, 58, 60, 61, 62, 63, 68, 71].includes(wordType)){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 1));
      weakStems = weakStems.map((stem: string) => this.removeLastN( stem, 1));
    }
    if([54, 59, 76].includes(wordType)){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 2) + 's');
      weakStems = strongStems;
    }
    if(wordType == 56){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 1) + 'o');
      weakStems = weakStems.map((stem: string) => this.removeLastN(stem, 1) + 'o');
    }
    //additional stems
    if(wordType == 60){
      let stem: string = this.removeLastN(strongStem, 3) + 'ks';
      strongStems.push(stem);
      weakStems.push(stem);
    }
    //additional stems
    if(wordType == 68){
      strongStems.push(strongStems[0] + 'its');
      weakStems = strongStems;
    }
    fiConjugation.moods.indicative.past.singular1 = this.concatEndToStems(weakStems, 'in');
    fiConjugation.moods.indicative.past.singular2 = this.concatEndToStems(weakStems, 'it');
    fiConjugation.moods.indicative.past.singular3 = this.concatEndToStems(strongStems, 'i');
    fiConjugation.moods.indicative.past.plural1 = this.concatEndToStems(weakStems, 'imme');
    fiConjugation.moods.indicative.past.plural2 = this.concatEndToStems(weakStems, 'itte');
    fiConjugation.moods.indicative.past.plural3 = this.concatEndToStems(strongStems, 'iv' + a + 't');
    fiConjugation.moods.indicative.past.negative1 = this.concatEndToStems(participlePastActiveStems, u + 't');
    fiConjugation.moods.indicative.past.negative2 = this.concatEndToStems(participlePastActiveStems, 'eet');
  }

  /**
   * Joins an array of stems with the same end and returns it sorted.
   * 
   * @param stems The stems without the end.
   * @param end The end that is going to be joined to the stem.
   * @returns The sorted array of stems joined to the end.
   */
  private concatEndToStems = (stems: string[], end: string) => stems.map((stem: string) => stem + end).sort();

  /**
   * Conjugates the conditional present tense.
   * 
   * @param strongStem The strong stem of the verb.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateConditional(strongStem: string, a: string, wordType: number, fiConjugation: FiConjugation): void {
    //initial stems
    let strongStems: string[] = [strongStem];
    if(wordType == 65){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 1) + 'v');
    }
    if(wordType == 64){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 2) + this.getLastN(stem,1));
    }
    if([58, 59, 60, 61, 62, 63, 66, 67, 68, 69, 70, 71, 72, 73, 74].includes(wordType)){
      strongStems = strongStems.map((stem: string) => this.removeLastN(stem, 1));
    }
    //additional stems
    if(wordType == 68){
      strongStems.push(strongStems[0] + 'its');
    }
    if(wordType == 74){
      strongStems.push(strongStems[0] + a);
    }
    fiConjugation.moods.conditional.present.singular1 = this.concatEndToStems(strongStems, 'isin');
    fiConjugation.moods.conditional.present.singular2 = this.concatEndToStems(strongStems, 'isit');
    fiConjugation.moods.conditional.present.singular3 = this.concatEndToStems(strongStems, 'isi');
    fiConjugation.moods.conditional.present.plural1 = this.concatEndToStems(strongStems, 'isimme');
    fiConjugation.moods.conditional.present.plural2 = this.concatEndToStems(strongStems, 'isitte');
    fiConjugation.moods.conditional.present.plural3 = this.concatEndToStems(strongStems, 'isiv' + a + 't');
    fiConjugation.moods.conditional.present.negative1 = this.concatEndToStems(strongStems, 'isi');
  }

  /**
   * Conjugates the imperative present tense.
   * 
   * @param verb The verb.
   * @param strongStem The strong stem of the verb.
   * @param weakStem The weak stem of the verb.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateImperative(verb: string, strongStem: string, weakStem: string,
      a: string, o: string, wordType: number, fiConjugation: FiConjugation): void {
    //initial stems
    let singular2: string[] = [66, 67, 72, 73, 74, 75].includes(wordType) ? [strongStem] : [weakStem];
    let nonSingular2Stems: string = [66, 67].includes(wordType) ? this.removeLastN(weakStem, 1) :
      wordType == 69 ? this.removeLastN(strongStem, 2) :
      wordType == 70 ? this.removeLastN(strongStem, 3) + 's' :
      wordType == 71 ? this.removeLastN(verb, 2) :
      wordType == 72 ? this.removeLastN(weakStem, 2) + 't' :
      [73, 74, 75].includes(wordType) ? this.removeLastN(weakStem, 1) + 't' : strongStem;
    //additional stems
    if(wordType == 68){
      singular2.push(singular2[0] + 'tse');
    }
    fiConjugation.moods.imperative.present.singular2 = singular2;
    fiConjugation.moods.imperative.present.singular3.push(nonSingular2Stems + 'k' + o + o + 'n');
    fiConjugation.moods.imperative.present.plural1.push(nonSingular2Stems + 'k' + a + a + 'mme');
    fiConjugation.moods.imperative.present.plural2.push(nonSingular2Stems + 'k' + a + a);
    fiConjugation.moods.imperative.present.plural3.push(nonSingular2Stems + 'k' + o + o + 't');
    fiConjugation.moods.imperative.present.negative1.push(nonSingular2Stems + 'k' + o);
  }

  /**
   * Conjugates the potential present tense.
   * 
   * @param participlePastActiveStems The stem from the participle past active.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugatePotential(participlePastActiveStems: string[], a: string, fiConjugation: FiConjugation): void {
    fiConjugation.moods.potential.present.singular1 = this.concatEndToStems(participlePastActiveStems, 'en');
    fiConjugation.moods.potential.present.singular2 = this.concatEndToStems(participlePastActiveStems, 'et');
    fiConjugation.moods.potential.present.singular3 = this.concatEndToStems(participlePastActiveStems, 'ee');
    fiConjugation.moods.potential.present.plural1 = this.concatEndToStems(participlePastActiveStems, 'emme');
    fiConjugation.moods.potential.present.plural2 = this.concatEndToStems(participlePastActiveStems, 'ette');
    fiConjugation.moods.potential.present.plural3 = this.concatEndToStems(participlePastActiveStems, 'ev' + a + 't');
    fiConjugation.moods.potential.present.negative1 = this.concatEndToStems(participlePastActiveStems, 'e');
  }

  /**
   * Conjugates the nominal forms of the verb.
   * 
   * @param verb The verb.
   * @param strongStem The strong stem of the verb.
   * @param participlePastActiveStems The stem from the participle past active.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param u The 'u' or 'y' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateNominalForms(verb: string, strongStem: string, participlePastActiveStems: string[],
      a: string, o: string, u: string, wordType: number, fiConjugation: FiConjugation): void{
    this.conjugateInfinitives(verb, strongStem, a, wordType, fiConjugation);
    this.conjugateParticiples(strongStem, participlePastActiveStems, a, o, u, wordType, fiConjugation);
  }

  /**
   * Conjugates the infinitive forms.
   * @param verb The verb.
   * @param strongStem The strong stem of the verb.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateInfinitives(verb: string, strongStem: string, a: string, wordType: number, fiConjugation: FiConjugation): void{
    let optionalD: string = [62, 63, 64, 65, 68].includes(wordType) ? 'd' : '';
    //initial stems
    let secondStem: string = [66, 67, 69, 70, 71, 72, 73, 74, 75].includes(wordType) ? this.removeLastN(verb, 1) : strongStem;
    let strongStems: string[] = [strongStem];
    //additional stems
    if(wordType == 68){
      strongStems.push(strongStems[0] + 'tse')
    }
    fiConjugation.nominalForms.infinitives.first.push(verb);
    fiConjugation.nominalForms.infinitives.firstLong.push(verb + 'kseen');
    fiConjugation.nominalForms.infinitives.secondInessiveActive.push(secondStem + optionalD + 'ess' + a);
    fiConjugation.nominalForms.infinitives.secondInstructive.push(secondStem + optionalD + 'en');
    fiConjugation.nominalForms.infinitives.thirdInessive = this.concatEndToStems(strongStems, 'm' + a + 'ss' + a);
    fiConjugation.nominalForms.infinitives.thirdElative = this.concatEndToStems(strongStems, 'm' + a + 'st' + a);
    fiConjugation.nominalForms.infinitives.thirdIllative = this.concatEndToStems(strongStems, 'm' + a + a + 'n');
    fiConjugation.nominalForms.infinitives.thirdAdessive = this.concatEndToStems(strongStems, 'm' + a + 'll' + a);
    fiConjugation.nominalForms.infinitives.thirdAbessive = this.concatEndToStems(strongStems, 'm' + a + 'tt' + a);
    fiConjugation.nominalForms.infinitives.thirdInstructiveActive = this.concatEndToStems(strongStems, 'm' + a + 'n');
    fiConjugation.nominalForms.infinitives.fourthNominative = this.concatEndToStems(strongStems, 'minen');
    fiConjugation.nominalForms.infinitives.fourthPartitive = this.concatEndToStems(strongStems, 'mist' + a);
    fiConjugation.nominalForms.infinitives.fifth = this.concatEndToStems(strongStems, 'm' + a + 'isill' + a + a + 'n');
  }

  /**
   * Conjugate the participle forms.
   * 
   * @param strongStem The strong stem of the verb.
   * @param participlePastActiveStems The stem from the participle past active.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param u The 'u' or 'y' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugateParticiples(strongStem: string, participlePastActiveStems: string[],
      a: string, o: string, u: string, wordType: number, fiConjugation: FiConjugation): void {
    //initial stems
    let strongStems: string[] = [strongStem];
    //additional stems
    if(wordType == 68){
      strongStems.push(strongStems[0] + 'tse');
    }
    fiConjugation.nominalForms.participles.presentActive = this.concatEndToStems(strongStems, 'v' + a);
    fiConjugation.nominalForms.participles.pastActive = this.concatEndToStems(participlePastActiveStems, u + 't');
    fiConjugation.nominalForms.participles.agent = this.concatEndToStems(strongStems, 'm' + a);
    fiConjugation.nominalForms.participles.negative = this.concatEndToStems(strongStems, 'm' + a + 't' + o + 'n');
  }

  /**
   * Conjugates all the passive forms.
   * 
   * @param verb The verb.
   * @param passiveWeakStem The passive weak stem.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param u The 'u' or 'y' vowel depending on its vowel harmony.
   * @param wordType The type of the verb (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiConjugation The object where the conjugations are stored.
   */
  private conjugatePassives(verb: string, passiveWeakStem: string, a: string, o: string, u: string,
      wordType: number, fiConjugation: FiConjugation): void {
    //This variable is used to know if the indicative present passive forms should have a 't', a 'd' or nothing just before the ending part.
    let passiveT: string = [62, 63, 64, 65, 68, 71].includes(wordType) ? 'd' :
      [67].includes(wordType) ? '' : 't';
    let presentStem: string = [67].includes(wordType) ? this.removeLastN(verb, 1) : passiveWeakStem;
    fiConjugation.moods.indicative.present.passive.push(presentStem + passiveT + a + a + 'n');
    fiConjugation.moods.indicative.present.passiveNegative.push(presentStem + passiveT + a);
    //This variable is used to know if the remaining passive forms should have a 'tt' or a 't' just before the ending part.
    let passiveTT: string = [62, 63, 64, 65, 66, 67, 68, 70, 71].includes(wordType) ? 't' : 'tt';
    fiConjugation.moods.indicative.past.passive.push(passiveWeakStem + passiveTT + 'iin');
    fiConjugation.moods.indicative.past.passiveNegative.push(passiveWeakStem + passiveTT + u);
    fiConjugation.moods.conditional.present.passive.push(passiveWeakStem + passiveTT + a + 'isiin');
    fiConjugation.moods.conditional.present.passiveNegative.push(passiveWeakStem + passiveTT + a + 'isi');
    fiConjugation.moods.imperative.present.passive.push(passiveWeakStem + passiveTT + a + 'k' + o + o + 'n');
    fiConjugation.moods.imperative.present.passiveNegative.push(passiveWeakStem + passiveTT + a + 'k' + o);
    fiConjugation.moods.potential.present.passive.push(passiveWeakStem + passiveTT + a + 'neen');
    fiConjugation.moods.potential.present.passiveNegative.push(passiveWeakStem + passiveTT + a + 'ne');
    fiConjugation.nominalForms.infinitives.secondInessivePassive.push(passiveWeakStem + passiveTT + a + 'ess' + a);
    fiConjugation.nominalForms.infinitives.thirdInstructivePassive.push(passiveWeakStem + passiveTT + a + 'm' + a + 'n');
    fiConjugation.nominalForms.participles.presentPassive.push(passiveWeakStem + passiveTT + a + 'v' + a);
    fiConjugation.nominalForms.participles.pastPassive.push(passiveWeakStem + passiveTT + u);
    
  }

}
