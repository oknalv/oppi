import { Injectable } from '@angular/core';
import { FiDeclension } from '../model/fi-inflection';
import { FiNominalData, FiWordType } from '../model/word-data';
import { FiVowelHarmony } from '../model/fi-vowel-harmony';
import { FiInflectionService, InvalidWordDataError } from './fi-inflection.service';

/**
 * The service which declines Finnish nominals.
 */
@Injectable()
export class FiDeclensionService extends FiInflectionService<FiNominalData, FiDeclension> {

  private endsInDiphthongAndDoubleVowelRegExp: RegExp = /^.*(aa|ee|ii|oo|uu|ää|öö|yy|ai|ei|oi|ui|yi|äi|öi|au|eu|iu|ou|ey|iy|äy|öy|ie|uo|yö)$/;
  private type22EndingRegExp: RegExp = /[aeiouäöyû]*.{2}$/;
  private vowels: string = 'aeiouäöy';

  constructor() {
    super();
  }

  /**
   * Declines a Finnish nominal using the `fiNominalData` param.
   * 
   * @param fiNominalData A FiNominalData that contains the data which this method needs to decline a nominal.
   * @returns The declension of the finnish nominal given in `fiNominalData`.
   */
  inflect(fiNominalData: FiNominalData): FiDeclension[] {
    try {
      let nominal: string = fiNominalData.word;
      // If it is a numeral ending in 'toista', it declines only the non 'toista' part
      if(nominal.endsWith('toista')){
        let fiNominalData2: FiNominalData = {
          ...fiNominalData,
          word: nominal.split('toista')[0]
        };
        return this.inflect(fiNominalData2).map((fiDeclension: FiDeclension) => {
          for(let key in fiDeclension.singular){
            if(key != 'instructive' && key != 'comitative'){
              fiDeclension.singular[key] = fiDeclension.singular[key].map((word) => word + 'toista');
            }
          };
          for(let key in fiDeclension.plural){
            if(key != 'nominativeGenitive'){
              if(key == 'comitative'){
                fiDeclension.plural[key] = fiDeclension.plural[key].map((word) => this.removeLastN(word, 2) + 'toista');
              } else {
                fiDeclension.plural[key] = fiDeclension.plural[key].map((word) => word + 'toista');
              }
            }
          };
          return fiDeclension;
        });
      }
      let fiDeclensions: FiDeclension[] = [];
      let wordTypes: FiWordType[] = fiNominalData.types;
      let wordHarmonyVowels: string[] = fiNominalData.vowelHarmony;
      let a: string = wordHarmonyVowels[FiVowelHarmony.a];
      let o: string = wordHarmonyVowels[FiVowelHarmony.o];
      wordTypes.sort((a: FiWordType, b: FiWordType): number => a.type - b.type);
      for(let type of wordTypes){
        let wordType: number = type.type;
        if(wordType == 49){
            wordType = nominal.endsWith('e') ? 48 : 32;
        }
        let wordGradation: string = type.gradation;
        let fiDeclension: FiDeclension = new FiDeclension();
        let singularStrongStem: string = this.getSingularStrongStem(nominal, a, wordType, wordGradation);
        let singularWeakStem: string = this.getSingularWeakStem(singularStrongStem, wordType, wordGradation);
        this.declineSingular(nominal, singularStrongStem, singularWeakStem, a, wordType, fiDeclension);
        this.declinePlural(nominal, singularStrongStem, singularWeakStem, a, o, wordType, fiDeclension);
        fiDeclensions.push(fiDeclension);
      }
      return fiDeclensions;
    } catch(e){
      throw new InvalidWordDataError(fiNominalData);
    }
  }

  /**
   * Declines the singular cases.
   * 
   * @param nominal The nominal to be declined.
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param fiDeclension The object where the declensions are stored.
   */
  private declineSingular(nominal: string, singularStrongStem: string, singularWeakStem:string,
      a: string, wordType: number, fiDeclension: FiDeclension): void {
    fiDeclension.singular.nominative.push(nominal);
    fiDeclension.singular.genitive.push(this.getSingularGenitive(singularWeakStem));
    fiDeclension.singular.partitive = this.getSingularPartitives(nominal, singularStrongStem, a, wordType);
    fiDeclension.singular.nominativeAccusative = fiDeclension.singular.nominative;
    fiDeclension.singular.genitiveAccusative = fiDeclension.singular.genitive;
    fiDeclension.singular.inessive.push(this.getSingularInessive(singularWeakStem, a));
    fiDeclension.singular.elative.push(this.getSingularElative(singularWeakStem, a));
    fiDeclension.singular.illative = this.getSingularIllatives(singularStrongStem, wordType);
    fiDeclension.singular.adessive.push(this.getSingularAdessive(singularWeakStem, a));
    fiDeclension.singular.ablative.push(this.getSingularAblative(singularWeakStem, a));
    fiDeclension.singular.allative.push(this.getSingularAllative(singularWeakStem));
    fiDeclension.singular.essive.push(this.getSingularEssive(singularStrongStem, a));
    fiDeclension.singular.translative.push(this.getSingularTranslative(singularWeakStem));
    fiDeclension.singular.abessive.push(this.getSingularAbessive(singularWeakStem, a));
  }
  
  /**
   * Declines the plural cases.
   * 
   * @param nominal The nominal to be declined.
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param declension The object where the declensions are stored.
   */
  private declinePlural(nominal: string, singularStrongStem: string, singularWeakStem: string,
      a: string, o: string, wordType: number, declension: FiDeclension): void {
    let pluralStrongStem: string = this.getPluralStrongStem(nominal, singularStrongStem, o, wordType);
    let pluralWeakStem: string = this.getPluralWeakStem(singularWeakStem, pluralStrongStem, o, wordType);
    declension.plural.nominative.push(this.getPluralNominative(singularWeakStem));
    declension.plural.genitive = this.getPluralGenitives(nominal, singularStrongStem, pluralStrongStem, pluralWeakStem, wordType);
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

  /**
   * Gets the singular genitive case using the singular weak stem.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @returns The singular genitive case.
   */
  private getSingularGenitive(singularWeakStem: string): string{
    return singularWeakStem + 'n';
  }

  /**
   * Gets the singular partitive cases using either the nominal or the singular strong stem, depending on the word type.
   * @param nominal The nominal.
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The singular partitive cases.
   */
  private getSingularPartitives(nominal: string, singularStrongStem: string, a: string, wordType: number): string[] {
    let partitives: string[] = [];
    //stem
    let stem = singularStrongStem; //types 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 25, 26, 35
    if([32, 33, 34, 35, 36, 37, 39, 41, 42, 43, 44, 46, 47].includes(wordType)){
      stem = nominal;
    }
    if([23, 24, 26, 27, 28, 31, 38, 40].includes(wordType)){
      stem = this.removeLastN(singularStrongStem, 1);
    }
    if(wordType == 29 || wordType == 30){
      stem = this.removeLastN(nominal, 3) + 's';
    }
    if(wordType == 45){
      stem = this.removeLastN(nominal, 1) + 't';
    }
    if(wordType == 48){
      stem = nominal + 't';
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
      partitives.push(this.removeLastN(nominal, 2) + 'nt' + a);
    }
    if(wordType == 37){
      partitives.push(singularStrongStem + a);
    }
    return partitives.sort();
  }

  /**
   * Gets the singular inessive case using the singular weak stem and the 'a' or 'ä' ending.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @returns The singular inessive case.
   */
  private getSingularInessive(singularWeakStem: string, a: string): string {
    return singularWeakStem + 'ss' + a;
  }

  /**
   * Gets the singular elative case using the singular weak stem and the 'a' or 'ä' ending.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @returns The singular elative case.
   */
  private getSingularElative(singularWeakStem: string, a: string): string {
    return singularWeakStem + 'st' + a;
  }

  /**
   * Gets the singular illative cases using the singular strong stem and the word type.
   * 
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The singular illative cases.
   */
  private getSingularIllatives(singularStrongStem: string, wordType: number): string[] {
    let illatives: string[] = [];
    //types 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 45, 46
    if(!([17, 18, 19, 20, 21, 22, 41, 44, 47, 48].includes(wordType))){
      illatives.push(singularStrongStem + singularStrongStem[singularStrongStem.length -1] + 'n');
    } else {
      if([17, 20, 41, 44, 47, 48].includes(wordType)){
        illatives.push(singularStrongStem + 'seen');
      }
      if([18, 19, 20, 21, 22].includes(wordType)){
        let vowel: string = singularStrongStem[singularStrongStem.length - 1];
        //this is for loan words of type 21 and 22
        vowel = vowel == 'é' ? 'e' : vowel;
        if(wordType == 22){
          let lastVowels: string = singularStrongStem.match(this.type22EndingRegExp)[0];
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
        illatives.push(singularStrongStem + 'h' + vowel + 'n');
      }
    }
    return illatives.sort();
  }

  /**
   * Gets the singular adessive case using the singular weak stem and the 'a' or 'ä' ending.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @returns The singular adessive case.
   */
  private getSingularAdessive(singularWeakStem: string, a: string): string {
    return singularWeakStem + 'll' + a;
  }

  /**
   * Gets the singular ablative case using the singular weak stem and the 'a' or 'ä' ending.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @returns The singular ablative case.
   */
  private getSingularAblative(singularWeakStem: string, a: string): string {
    return singularWeakStem + 'lt' + a;
  }

  /**
   * Gets the singular allative case using the singular weak stem.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @returns The singular allative case.
   */
  private getSingularAllative(singularWeakStem: string): string {
    return singularWeakStem + 'lle';
  }

  /**
   * Gets the singular essive case using the singular strong stem and the 'a' or 'ä' ending.
   * 
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @returns The singular essive case.
   */
  private getSingularEssive(singularStrongStem: string, a: string): string {
    return singularStrongStem + 'n' + a;
  }

  /**
   * Gets the singular translative case using the singular weak stem.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @returns The singular translative case.
   */
  private getSingularTranslative(singularWeakStem: string): string {
    return singularWeakStem + 'ksi';
  }

  /**
   * Gets the singular abessive case using the singular weak stem and the 'a' or 'ä' ending.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @returns The singular abessive case.
   */
  private getSingularAbessive(singularWeakStem: string, a: string): string {
    return singularWeakStem + 'tt' + a;
  }

  /**
   * Gets the plural nominative case using the singular weak stem.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @returns The plural nominative case.
   */
  private getPluralNominative(singularWeakStem: string): string {
    return singularWeakStem + 't';
  }

  /**
   * Gets the plural genitive cases using the nominal and different stems depending on the word type.
   * 
   * @param nominal The nominal.
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param pluralStrongStem The plural strong stem of the nominal.
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural genitive cases.
   */
  private getPluralGenitives(nominal: string, singularStrongStem: string, pluralStrongStem: string, pluralWeakStem: string, wordType: number): string[] {
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
      genitives.push(nominal + 'ten');
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

  /**
   * Gets the plural partitive cases using different stems depending on the word type, and the 'a' or 'ä' vowel.
   * 
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param pluralStrongStem The plural strong stem of the nominal.
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @return The plural partitive cases.
   */
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

  /**
   * Gets the common transformation for the most of cases on plural form using the plural weak stem and the
   * word type and adds the ending of the case given by the param `ending`.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param ending The ending of the case.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The corresponding plural cases.
   */
  private getCommonPluralFormingCases(pluralWeakStem : string, ending: string, wordType: number){
    let stem =  pluralWeakStem;
    let cases: string [] = [stem + ending];
    if(wordType == 11){
      cases.push(this.removeLastN(pluralWeakStem, 2) + 'i' + ending);
    }
    return cases.sort();
  }

  /**
   * Gets the plural inessive cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural inessive cases.
   */
  private getPluralInessives(pluralWeakStem: string, a: string, wordType: number): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'ss' + a, wordType);
  }

  /**
   * Gets the plural elative cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural elative cases.
   */
  private getPluralElatives(pluralWeakStem: string, a: string, wordType: number): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'st' + a, wordType);
  }

  /**
   * Gets the plural illative cases using either the plural strong stem or the plural weak stem depending on the word type.
   * 
   * @param pluralStrongStem The plural strong stem of the nominal.
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural illative cases.
   */
  private getPluralIllatives(pluralStrongStem: string, pluralWeakStem: string, wordType: number): string[] {
    let illatives: string[] = [];
    //stem
    let stem = pluralStrongStem;
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
      illatives.push(pluralWeakStem + 'hin');
    }
    if(wordType == 11){
      illatives.push(this.removeLastN(pluralWeakStem, 2) + 'iin');
    }
    return illatives.sort();
  }

  /**
   * Gets the plural adessive cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural adessive cases.
   */
  private getPluralAdessives(pluralWeakStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'll' + a, wordType);
  }

  /**
   * Gets the plural ablative cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural ablative cases.
   */
  private getPluralAblatives(pluralWeakStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'lt' + a, wordType);
  }

  /**
   * Gets the plural allative cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural allative cases.
   */
  private getPluralAllatives(pluralWeakStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'lle', wordType);
  }

  /**
   * Gets the plural essive cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralStrongStem The plural strong stem of the nominal (it doens't use the weak stem as the other plural common forming methods).
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural essive cases.
   */
  private getPluralEssives(pluralStrongStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralStrongStem, 'n' + a, wordType);
  }

  /**
   * Gets the plural translative cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural translative cases.
   */
  private getPluralTranslatives(pluralWeakStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'ksi', wordType);
  }

  /**
   * Gets the plural abessive cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural abessive cases.
   */
  private getPluralAbessives(pluralWeakStem: string, a: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'tt' + a, wordType);
  }

  /**
   * Gets the plural instructive cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural weak stem of the nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural instructive cases.
   */
  private getPluralInstructives(pluralWeakStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'n', wordType);
  }

  /**
   * Gets the plural comitative cases calling the `getCommonPluralFormingCases` method and adding its own ending.
   * 
   * @param pluralWeakStem The plural strong stem of the nominal (it doens't use the weak stem as the other plural common forming methods).
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural comitative cases.
   */
  private getPluralComitatives(pluralWeakStem: string, wordType): string[] {
    return this.getCommonPluralFormingCases(pluralWeakStem, 'neen', wordType);
  }

  /**
   * Gets the inverse gradation of the nominal.
   * 
   * @param nominal The nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param wordGradation The gradation type.
   * @returns The inverse gradation.
   */
  private inverseGradate(nominal: string, wordType: number, wordGradation: string): string {
    let splitNumber: number = nominal == 'kerroin' ? 3 : wordType == 48 ? 1:  2;
    let nominalBeginning: string = this.removeLastN(nominal, splitNumber);
    let nominalEnd: string = this.getLastN(nominal, splitNumber);
    return this.inverseGradateWordBeginning(nominalBeginning, wordGradation) + nominalEnd;
  }

  /**
   * Gets the gradation of the nominal.
   * 
   * @param nominal The nominal.
   * @param wordGradation The gradation type.
   * @returns The gradation.
   */
  private gradate(nominal: string, wordGradation: string): string {
    let nominalBeginning: string = this.removeLastN(nominal, 1);
    let nominalEnd: string = this.getLastN(nominal, 1);
    return this.gradateWordBeginning(nominalBeginning, wordGradation) + nominalEnd;
  }

  /**
   * Gets the singular strong stem.
   * 
   * @param nominal The nominal.
   * @param a The 'a' or 'ä' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param wordGradation The gradation type.
   * @returns The singular strong stem.
   */
  private getSingularStrongStem(nominal: string, a: string, wordType: number, wordGradation: string): string {
    //stem
    let stem: string = nominal; //1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
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
    if(wordType == 10 && nominal.endsWith('n')){
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

  /**
   * Gets the plural strong stem.
   * 
   * @param nominal The nominal.
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural strong stem.
   */
  private getPluralStrongStem(nominal: string, singularStrongStem: string, o: string, wordType: number): string {
    let stem = singularStrongStem;
    if([5, 6, 8].includes(wordType)){
      return this.removeLastN(stem, 1) + 'ei';
    }
    if([7, 23, 24, 25, 26, 27, 28, 29, 30, 31].includes(wordType)){
      return nominal;
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
      return this.removeLastN(nominal, 1) + 'ksi';
    }
    if(wordType == 45 || wordType == 46){
      return this.removeLastN(nominal, 1) + 'nsi';
    }
    return stem + 'i';
  }

  /**
   * Gets the singular weak stem.
   * 
   * @param singularStrongStem The singular strong stem of the nominal.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @param wordGradation The gradation type.
   * @returns The singular weak stem.
   */
  private getSingularWeakStem(singularStrongStem: string, wordType: number, wordGradation: string): string {
    let stem = singularStrongStem;
    if([1, 4, 5, 7, 8, 9, 10, 14, 16, 27, 28, 31, 36, 37, 40, 45, 46].includes(wordType) && wordGradation != null){
      stem = this.gradate(stem, wordGradation);
    }
    if(wordType == 41 || wordType == 44){
      return this.removeLastN(stem, 1) + stem[stem.length - 2];
    }
    return stem;

  }

  /**
   * Gets the plural weak stem.
   * 
   * @param singularWeakStem The singular weak stem of the nominal.
   * @param pluralStrongStem The plural strong stem of the nominal.
   * @param o The 'o' or 'ö' vowel depending on its vowel harmony.
   * @param wordType The type of the nominal (KOTUS: http://kaino.kotus.fi/sanat/nykysuomi/taivutustyypit.php).
   * @returns The plural weak stem.
   */
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

  /**
   * Checks if the letter is a Finnish vowel.
   * @param letter The letter to check.
   * @return `true` if it is a Finnish vowel, `false` if not.
   */
  private isVowel = (letter: string): boolean => this.vowels.includes(letter);

}
