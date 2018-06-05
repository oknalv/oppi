import { WordData } from '../model/word-data';

export class InvalidWordDataError implements Error {
  name: string = 'InvalidWordDataError';
  message: string = 'Invalid word data';

  constructor(wordInfo: WordData){
    this.message += ': ' + JSON.stringify(wordInfo);
  }
}

/**
 * Class with common methods for the both Finnish conjugation and Finnish declension services.
 */
export abstract class FiInflectionService<T extends WordData,S> {

  /**
   * The common method that does de magic of inflection of a word.
   * 
   * @param wordData The word data.
   */
  abstract inflect(wordData: T): S[];

  /**
   * Gets the `word` without the last `n` letters.
   * 
   * @param word The word.
   * @param n The number of letters to remove.
   * @return The new word.
   */
  protected removeLastN = (word: string, n: number): string => word.substr(0, word.length - n);

  /**
   * Gets the last `n` letters of the `word`.
   * 
   * @param word The word.
   * @param n The number of letters to get.
   * @return The new word.
   */
  protected getLastN = (word: string, n: number): string => word.substr(word.length - n, word.length);

  /**
   * Inverse gradates a word beginning.
   * 
   * @param wordBeginning The word beginning.
   * @param wordGradation The gradation type.
   * @returns The inverse gradated word beginning. 
   */
  protected inverseGradateWordBeginning(wordBeginning: string, wordGradation): string {
    switch(wordGradation){
      case 'tt-t': case 'kk-k': case 'pp-p':case 'rh-r':
      return wordBeginning + wordGradation[1];
      case 'k-': case 't-':
      return wordBeginning + wordGradation[0];
      case 'p-v': case 't-d': case 'k-j':
      return this.removeLastN(wordBeginning, 1) + wordGradation[0];
      case 'lt-ll': case 'nt-nn': case 'rt-rr': case 'nk-ng': case 'mp-mm':
      return this.removeLastN(wordBeginning, 1) + wordGradation[1];
      default:
      return wordBeginning;
    }
  }

  /**
   * Gradates a word beginning.
   * 
   * @param wordBeginning The word beginning.
   * @param wordGradation The gradation type.
   * @returns The gradated word beginning. 
   */
  protected gradateWordBeginning(wordBeginning, wordGradation): string {
    switch(wordGradation){
      case 'kk-k': case 'pp-p': case 'tt-t': case 'k-': case 'dd-d': case 'gg-g':
      return this.removeLastN(wordBeginning, 1);
      case 'p-v': case 't-d': case 'k-v': case 'k-j': case 'k-\'':
      return this.removeLastN(wordBeginning, 1) + wordGradation[2];
      case 'mp-mm': case 'lt-ll': case 'nt-nn': case 'rt-rr': case 'nk-ng':
      return this.removeLastN(wordBeginning, 1) + wordGradation[4];
      case 'ik-j': case 'ok-u': case 'tt-y':
      return this.removeLastN(wordBeginning, 2) + wordGradation[3];
      default:
      return wordBeginning;
    }
  }

}