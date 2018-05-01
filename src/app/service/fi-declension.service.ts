import { Injectable } from '@angular/core';
import { Declension } from '../model/declension';
import { FiDeclensionWordInfo } from '../model/fi-declension-word-info';
import { FiVowelHarmony } from '../model/fi-vowel-harmony';

export class InvalidWordInfoError implements Error {
  name: string = 'InvalidWordInfoError';
  message: string = 'Invalid word info';
}

@Injectable()
export class FiDeclensionService {

  private endsInDiphthongAndDoubleVowelRegExp: RegExp = /^.*(aa|ee|ii|oo|uu|ää|öö|yy|ai|ei|oi|ui|yi|äi|öi|au|eu|iu|ou|ey|iy|äy|öy|ie|uo|yö)$/;
  private type22EndingRegExp: RegExp = /[aeiouäöyû]*.{2}$/;
  private vowels: string = 'aeiouäöy';

  constructor() { }

  decline(wordInfo: FiDeclensionWordInfo): Declension[] {
    try {
      let noun: string = wordInfo.word;
      if(noun.endsWith('toista')){
        let fiDeclensionMetadata2: FiDeclensionWordInfo = {
          id: wordInfo.id,
          word: noun.split('toista')[0],
          types: wordInfo.types,
          vowelHarmony: wordInfo.vowelHarmony
        };
        return this.decline(fiDeclensionMetadata2).map((declension: Declension) => {
          for(let key in declension.singular){
            if(key != 'instructive' && key != 'comitative'){
              declension.singular[key] = declension.singular[key].map(function(word){
                return word + 'toista';
              }.bind(this))
            }
          };
          for(let key in declension.plural){
            if(key != 'nominativeGenitive'){
              if(key == 'comitative'){
                declension.plural[key] = declension.plural[key].map(function(word){
                  return this.removeLastN(word, 2) + 'toista';
                }.bind(this));
              } else {
                declension.plural[key] = declension.plural[key].map(function(word){
                  return word + 'toista';
                }.bind(this));
              }
            }
          };
          return declension;
        });
      }
      let declensions: Declension[] = [];
      let wordTypes: object[] = wordInfo['types'];
      let wordHarmonyVowels = wordInfo['vowelHarmony']
      let a = wordHarmonyVowels[FiVowelHarmony.a];
      let o = wordHarmonyVowels[FiVowelHarmony.o];
      wordTypes.sort((a: object, b: object): number => a['type'] - b['type']);
      for(let type of wordTypes){
        let wordType = type['type'];
        if(wordType == 49){
            wordType = noun.endsWith('e') ? 48 : 32;
        }
        let wordGradation = type['gradation'];
        let declension: Declension = new Declension();
        let strongStem: string = this.getStrongStem(noun, a, wordType, wordGradation);
        let weakStem: string = this.getWeakStem(strongStem, wordType, wordGradation);
        this.declineSingular(noun, strongStem, weakStem, a, wordType, wordGradation, declension);
        this.declinePlural(noun, strongStem, weakStem, a, o, wordType, wordGradation, declension);
        declensions.push(declension);
      }
      return declensions;
    } catch(e){
      throw new InvalidWordInfoError();
    }
  }

  private declineSingular(noun: string, strongStem: string, weakStem:string, a: string, wordType: number, wordGradation: string, declension: Declension): void {
    declension.singular.nominative.push(noun);
    declension.singular.genitive.push(this.getSingularGenitive(strongStem, weakStem, wordType));
    declension.singular.partitive = this.getSingularPartitives(noun, strongStem, a, wordType);
    declension.singular.nominativeAccusative = declension.singular.nominative;
    declension.singular.genitiveAccusative = declension.singular.genitive;
    declension.singular.inessive.push(this.getSingularInessive(strongStem, weakStem, a, wordType));
    declension.singular.elative.push(this.getSingularElative(strongStem, weakStem, a, wordType));
    declension.singular.illative = this.getSingularIllatives(strongStem, wordType);
    declension.singular.adessive.push(this.getSingularAdessive(weakStem, a));
    declension.singular.ablative.push(this.getSingularAblative(weakStem, a));
    declension.singular.allative.push(this.getSingularAllative(weakStem));
    declension.singular.essive.push(this.getSingularEssive(strongStem, a));
    declension.singular.translative.push(this.getSingularTranslative(weakStem));
    declension.singular.abessive.push(this.getSingularAbessive(weakStem, a));
  }

  private declinePlural(noun: string, singularStrongStem: string, singularWeakStem: string, a: string, o: string, wordType: number, wordGradation: string, declension: Declension): void {
    let pluralStrongStem: string = this.getPluralStrongStem(noun, singularStrongStem, o, wordType);
    let pluralWeakStem: string = this.getPluralWeakStem(singularWeakStem, pluralStrongStem, o, wordType);
    declension.plural.nominative.push(this.getPluralNominative(singularWeakStem));
    declension.plural.genitive = this.getPluralGenitives(noun, singularStrongStem, pluralStrongStem, pluralWeakStem, wordType);
    declension.plural.partitive = this.getPluralPartitives(singularStrongStem, pluralStrongStem, pluralWeakStem, a, wordType);
    declension.plural.nominativeAccusative = declension.plural.nominative;
    declension.plural.inessive = this.getPluralInessives(pluralWeakStem, a, wordType);
    declension.plural.elative = this.getPluralElatives(pluralWeakStem, a, wordType);
    declension.plural.illative = this.getPluralIllatives(pluralStrongStem, pluralWeakStem, wordType);
    declension.plural.adessive = this.getPluralAdessives(pluralWeakStem, a, wordType);
    declension.plural.ablative = this.getPluralAblatives(pluralWeakStem, a, wordType);
    declension.plural.allative = this.getPluralAllatives(pluralWeakStem, wordType);
    declension.plural.essive = this.getPluralEssives(pluralStrongStem, a, wordType);
    declension.plural.translative = this.getPluralTranslatives(pluralWeakStem, wordType);
    declension.plural.instructive = this.getPluralInstructives(pluralWeakStem, wordType);
    declension.plural.abessive = this.getPluralAbessives(pluralWeakStem, a, wordType);
    declension.plural.comitative = this.getPluralComitatives(pluralStrongStem, wordType);
  }

  private getSingularGenitive(strongStem: string, weakStem: string, wordType: number): string{
    return weakStem + 'n';
  }

  private getSingularPartitives(noun: string, strongStem: string, a: string, wordType: number): string[] {
    let partitives: string[] = [];
    //stem
    let stem = strongStem; //types 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 25, 26, 35
    if([32, 33, 34, 35, 36, 37, 39, 41, 42, 43, 44, 46, 47].includes(wordType)){
      stem = noun;
    }
    if([23, 24, 26, 27, 28, 31, 38, 40].includes(wordType)){
      stem = this.removeLastN(strongStem, 1);
    }
    if(wordType == 29 || wordType == 30){
      stem = this.removeLastN(noun, 3) + 's';
    }
    if(wordType == 45){
      stem = this.removeLastN(noun, 1) + 't';
    }
    if(wordType == 48){
      stem = noun + 't';
    }
    //partitives
    //types 3, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48
    if(!([1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 25, 31].includes(wordType))){
      partitives.push(stem + 't' + a);
    }
    if([1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 25, 31].includes(wordType)) {
      partitives.push(stem + a);
    }
    //partitives with different stems
    if(wordType == 25){
      partitives.push(this.removeLastN(noun, 2) + 'nt' + a);
    }
    if(wordType == 37){
      partitives.push(strongStem + a);
    }
    return partitives.sort();
  }

  private getSingularInessive(strongStem: string, weakStem: string, a: string, wordType: number): string {
    return weakStem + 'ss' + a;
  }

  private getSingularElative(strongStem: string, weakStem: string, a: string, wordType: number): string {
    return weakStem + 'st' + a;
  }

  private getSingularIllatives(strongStem: string, wordType: number): string[] {
    let illatives: string[] = [];
    //types 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 45, 46
    if(!([17, 18, 19, 20, 21, 22, 41, 44, 47, 48].includes(wordType))){
      illatives.push(strongStem + strongStem[strongStem.length -1] + 'n');
    } else {
      if([17, 20, 41, 44, 47, 48].includes(wordType)){
        illatives.push(strongStem + 'seen');
      }
      if([18, 19, 20, 21, 22].includes(wordType)){
        let vowel: string = strongStem[strongStem.length - 1];
        //this is for loan words of type 21 and 22
        vowel = vowel == 'é' ? 'e' : vowel;
        if(wordType == 22){
          let lastVowels: string = strongStem.match(this.type22EndingRegExp)[0];
          lastVowels = lastVowels.substr(0, lastVowels.length - 2);
          vowel = lastVowels[lastVowels.length - 1];
          if(lastVowels == 'eau'){
            vowel = 'o';
          }
          if(lastVowels == 'ai'){
            vowel = 'e';
          }
          if(lastVowels.endsWith('ou') || lastVowels.endsWith('oû')){
            vowel = 'u';
          }
        }
        illatives.push(strongStem + 'h' + vowel + 'n');
      }
    }
    return illatives.sort();
  }

  private getSingularAdessive(weakStem: string, a: string): string {
    return weakStem + 'll' + a;
  }

  private getSingularAblative(weakStem: string, a: string): string {
    return weakStem + 'lt' + a;
  }

  private getSingularAllative(weakStem: string): string {
    return weakStem + 'lle';
  }

  private getSingularEssive(strongStem: string, a: string): string {
    return strongStem + 'n' + a;
  }

  private getSingularTranslative(weakStem: string): string {
    return weakStem + 'ksi';
  }

  private getSingularAbessive(weakStem: string, a: string): string {
    return weakStem + 'tt' + a;
  }

  private getPluralNominative(weakStem: string): string {
    return weakStem + 't';
  }

  private getPluralGenitives(noun: string, singularStrongStem: string, pluralStrongStem: string, pluralWeakStem: string, wordType: number): string[] {
    let genitives: string[] = [];
    //stem
    let stem = pluralStrongStem;//2, 3, 6, 7, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
    if(wordType == 4 || wordType == 14){
      stem = pluralWeakStem;
    }
    //genitives
    if([7, 10, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 45, 46].includes(wordType)){
      genitives.push(stem + 'en');
    }
    if([2, 3, 4, 6, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 41, 43, 44, 47, 48].includes(wordType)){
      genitives.push(stem + 'den', stem + 'tten');
    }
    //genitives with different stems
    if([32, 33, 34, 36, 37, 39, 42].includes(wordType)){
      genitives.push(noun + 'ten');
    }
    if([24, 26, 27, 28, 38].includes(wordType)){
      genitives.push(this.removeLastN(singularStrongStem, 1) + 'ten');
    }
    if([8, 9, 10, 11, 12, 13, 14, 15, 16, 35, 36, 37].includes(wordType)){
      genitives.push(singularStrongStem + 'in')
    }
    if(wordType == 29 || wordType == 30){
      genitives.push(this.removeLastN(pluralStrongStem, 3) + 'sten')
    }
    if(wordType == 25){
      genitives.push(this.removeLastN(pluralStrongStem, 2) + 'nten')
    }
    if([1, 2, 4, 8, 9, 11, 13, 14].includes(wordType)){
      genitives.push(this.removeLastN(pluralStrongStem, 1) + 'jen')
    }
    if(wordType == 5 || wordType == 11){
      genitives.push(this.removeLastN(singularStrongStem, 1) + 'ien')
    }
    if(wordType == 6){
      genitives.push(singularStrongStem + 'en')
    }
    if(wordType == 46){
      genitives.push(singularStrongStem + 'n')
    }
    return genitives.sort();
  }

  private getPluralPartitives(singularStrongStem: string, pluralStrongStem: string, pluralWeakStem: string, a: string, wordType: number): string[] {
    let partitives: string[] = [];
    //stem
    let stem = pluralStrongStem;
    if(wordType == 4 || wordType == 14){
      stem = pluralWeakStem;
    }
    //partitives
    if([7, 10, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 45, 46].includes(wordType)){
      partitives.push(stem + a);
    }
    if([2, 3, 4, 6, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 41, 43, 44, 47, 48].includes(wordType)){
      partitives.push(stem + 't' + a);
    }
    //partitives with different stems
    if([1, 2, 4, 5, 6, 8, 9, 11, 13, 14].includes(wordType)){
      partitives.push(this.removeLastN(pluralStrongStem, 1) + 'j' + a);
    }
    if(wordType == 11){
      partitives.push(this.removeLastN(singularStrongStem, 1) + 'i' + a);
    }
    return partitives.sort();
  }

  private getCommonPluralFormingCases(weakStem : string, ending: string, wordType: number){
    let stem =  weakStem;
    let cases: string [] = [stem + ending];
    if(wordType == 11){
      cases.push(this.removeLastN(weakStem, 2) + 'i' + ending);
    }
    return cases.sort();
  }

  private getPluralInessives(weakStem: string, a: string, wordType: number): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'ss' + a, wordType);
  }

  private getPluralElatives(weakStem: string, a: string, wordType: number): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'st' + a, wordType);
  }

  private getPluralIllatives(strongStem: string, weakStem: string, wordType: number): string[] {
    let illatives: string[] = [];
    //stem
    let stem = strongStem;
    //illatives
    if([7, 10, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 45, 46].includes(wordType)){
      illatives.push(stem + 'in');
    }
    if([1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 41, 43, 44, 47, 48].includes(wordType)){
      illatives.push(stem + 'hin');
    }
    if([15, 17, 20, 41, 43, 44, 47, 48].includes(wordType)){
      illatives.push(stem + 'siin');
    }
    //illatives with different stems
    if(wordType == 4 || wordType == 14){
      illatives.push(weakStem + 'hin');
    }
    if(wordType == 11){
      illatives.push(this.removeLastN(weakStem, 2) + 'iin');
    }
    return illatives.sort();
  }

  private getPluralAdessives(weakStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'll' + a, wordType);
  }

  private getPluralAblatives(weakStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'lt' + a, wordType);
  }

  private getPluralAllatives(weakStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'lle', wordType);
  }

  private getPluralEssives(strongStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(strongStem, 'n' + a, wordType);
  }

  private getPluralTranslatives(weakStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'ksi', wordType);
  }

  private getPluralAbessives(weakStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'tt' + a, wordType);
  }

  private getPluralInstructives(weakStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(weakStem, 'n', wordType);
  }

  private getPluralComitatives(strongStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(strongStem, 'neen', wordType);
  }

  private inverseGradate(noun: string, wordType: number, wordGradation: string): string {
    let splitNumber: number = noun == 'kerroin' ? 3 : wordType == 48 ? 1:  2;
    let nounStart: string = this.removeLastN(noun, splitNumber);
    let nounEnd: string = this.getLastN(noun, splitNumber);
    switch(wordGradation){
      case 'tt-t': case 'kk-k': case 'pp-p':case 'rh-r':
      return nounStart + wordGradation[1] + nounEnd;
      case 'k-': case 't-':
      return nounStart + wordGradation[0] + nounEnd;
      case 'p-v': case 't-d': case 'k-j':
      return this.removeLastN(nounStart, 1) + wordGradation[0] + nounEnd;
      case 'lt-ll': case 'nt-nn': case 'rt-rr': case 'nk-ng': case 'mp-mm':
      return this.removeLastN(nounStart, 1) + wordGradation[1] + nounEnd;

    }
    return noun;
  }

  private gradate(noun: string, wordGradation: string): string {
    let nounStart: string = this.removeLastN(noun, 1);
    let nounEnd: string = this.getLastN(noun, 1);
    switch(wordGradation){
      case 'kk-k': case 'pp-p': case 'tt-t': case 'k-': case 'dd-d': case 'gg-g':
      return this.removeLastN(nounStart, 1) + nounEnd;
      case 'p-v': case 't-d': case 'k-v': case 'k-j': case 'k-\'':
      return this.removeLastN(nounStart, 1) + wordGradation[2] + nounEnd;
      case 'mp-mm': case 'lt-ll': case 'nt-nn': case 'rt-rr': case 'nk-ng':
      return this.removeLastN(nounStart, 1) + wordGradation[4] + nounEnd;
      case 'ik-j': case 'ok-u': case 'tt-y':
      return this.removeLastN(nounStart, 2) + wordGradation[3] + nounEnd;
    }
    return noun;
  }

  private getStrongStem(noun: string, a: string, wordType: number, wordGradation: string): string {
    //stem
    let stem: string = noun; //1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
    //inverse gradate
    if([32, 33, 41, 43, 48].includes(wordType) && wordGradation != null){
      stem = this.inverseGradate(stem, wordType, wordGradation);
    }
    //form stem
    if((wordType == 5 || wordType == 6) && !this.isVowel(stem[stem.length - 1])){
      return stem + 'i';
    }
    if([7, 23, 24, 25, 26, 29, 30, 43].includes(wordType)){
      return this.removeLastN(stem, 1) + 'e';
    }
    if(wordType == 10 && noun.endsWith('n')){
      return stem.substr(0, stem.length - 1);
    }
    if(wordType == 16){
      return this.removeLastN(stem, 1) + a;
    }
    if(wordType == 22){
      return stem + '\'';
    }
    if(wordType == 27 || wordType == 28){
      return this.removeLastN(stem, 2) + 'te';
    }
    if(wordType == 31){
      return this.removeLastN(stem, 3) + 'hte';
    }
    if(wordType == 32 || wordType == 48){
      return stem + 'e';
    }
    if(wordType == 33){
      return this.removeLastN(stem, 1) + 'me';
    }
    if(wordType == 34){
      return this.removeLastN(stem, 2) + 't' + stem[stem.length - 2] + 'm' + a;
    }
    if(wordType == 35){
      return this.removeLastN(stem, 3) + 'pim' + a;
    }
    if(wordType == 36 || wordType == 37){
      return this.removeLastN(stem, 1) + 'mp' + a;
    }
    if(wordType == 38){
      return this.removeLastN(stem, 3) + 'se';
    }
    if(wordType == 39){
      return this.removeLastN(stem, 1) + 'kse';
    }
    if(wordType == 40){
      return this.removeLastN(stem, 1) + 'te';
    }
    if(wordType == 41 || wordType == 44){
      return this.removeLastN(stem, 1) + stem[stem.length - 2];
    }
    if(wordType == 42){
      return this.removeLastN(stem, 1) + 'he';
    }
    if(wordType == 45 || wordType == 46){
      return this.removeLastN(stem, 1) + 'nte';
    }
    if(wordType == 47){
      return this.removeLastN(stem, 2) + 'ee';
    }
    return stem;
  }

  private getPluralStrongStem(noun: string, singularStrongStem: string, o: string, wordType: number): string {
    let stem = singularStrongStem;
    if([5, 6, 8].includes(wordType)){
      return this.removeLastN(stem, 1) + 'ei';
    }
    if([7, 23, 24, 25, 26, 27, 28, 29, 30, 31].includes(wordType)){
      return noun;
    }
    if([9, 11, 12, 13, 14].includes(wordType)){
      return this.removeLastN(stem, 1) + o + 'i';
    }
    if([10, 15, 16, 17, 18, 20, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 44, 47, 48].includes(wordType)){
      return this.removeLastN(stem, 1) + 'i';
    }
    if(wordType == 19){
      return this.removeLastN(stem, 2) + stem[stem.length -1] + 'i';
    }
    if(wordType == 40){
      return this.removeLastN(noun, 1) + 'ksi';
    }
    if(wordType == 45 || wordType == 46){
      return this.removeLastN(noun, 1) + 'nsi';
    }
    return stem + 'i';
  }

  private getWeakStem(strongStem: string, wordType: number, wordGradation: string): string {
    let stem = strongStem;
    if([1, 4, 5, 7, 8, 9, 10, 14, 16, 27, 28, 31, 36, 37, 40, 45, 46].includes(wordType) && wordGradation != null){
      stem = this.gradate(stem, wordGradation);
    }
    if(wordType == 41 || wordType == 44){
      return this.removeLastN(stem, 1) + stem[stem.length - 2];
    }
    return stem;

  }

  private getPluralWeakStem(singularWeakStem: string, pluralStrongStem: string, o: string, wordType: number): string {
    let stem = singularWeakStem;
    //types 2, 3, 6, 11, 12, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48
    if(!([1, 4, 5, 7, 8, 9, 10, 14, 16, 36, 37, 41].includes(wordType))){
      return pluralStrongStem;
    }
    if(wordType == 5){
      return this.removeLastN(stem, 1) + 'ei';
    }
    if([7, 10, 16, 18, 36, 37, 41].includes(wordType)){
      return this.removeLastN(stem, 1) + 'i';
    }
    if(wordType == 9 || wordType == 14){
      return this.removeLastN(stem, 1) + o + 'i';
    }
    return stem + 'i';

  }

  private removeLastN = (noun: string, n: number): string => {
    return noun.substr(0, noun.length - n);
  }

  private getLastN = (noun: string, n: number): string => {
    return noun.substr(noun.length - n, noun.length);
  }

  private isVowel = (letter: string): boolean => {
    return this.vowels.indexOf(letter) > -1;
  }

}
