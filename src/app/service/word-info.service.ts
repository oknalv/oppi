import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as words from '../data/nominals.json';

@Injectable()
export class WordInfoService{
  private words: object;
  private metadata: object;
  private types: string;
  private type: string;
  private gradation: string;
  private gradationTypes: object;
  private vowelHarmonyTypes: object;
  private vowelHarmony: string;

  public a: number = 0;
  public o: number = 1;
  public u: number = 2;

  constructor() {
    this.words = words['words'];
    this.metadata = words['metadata'];
    this.types = words['metadata']['types'];
    this.type = words['metadata']['type'];
    this.gradation = words['metadata']['gradation'];
    this.gradationTypes = words['metadata']['gradationTypes'];
    this.vowelHarmony = words['metadata']['vowelHarmony']
    if(words['metadata']['vowelHarmonyTypes']['0'] == 'frontVowel'){
      this.vowelHarmonyTypes = {0: ['ä', 'ö', 'y'], 1: ['a', 'o', 'u']};
    } else {
      this.vowelHarmonyTypes = {1: ['ä', 'ö', 'y'], 0: ['a', 'o', 'u']};      
    }
  }

  private transformWordInfo(word: string, wordInfo: object): object{
    let transformedWordInfo: object = {'types': []};
    wordInfo[this.types].forEach(function(wordType: object){
      let transformedWordType: object = {'type': wordType[this.type]};
      if(Object.keys(wordType).indexOf(this.gradation) > -1){
        transformedWordType['gradation'] = this.gradationTypes[wordType[this.gradation]];
      }
      transformedWordInfo['types'].push(transformedWordType);
    }.bind(this));
    if(Object.keys(wordInfo).indexOf(this.vowelHarmony) > -1) {
      transformedWordInfo['vowelHarmony'] = this.vowelHarmonyTypes[wordInfo[this.vowelHarmony]];
    }
    else {
      transformedWordInfo['vowelHarmony'] = word.indexOf('a') > -1 || word.indexOf('o') > -1 || word.indexOf('u') > -1 ? ['a', 'o', 'u'] : ['ä', 'ö', 'y'];
    }
    return transformedWordInfo;
  }

  getWordInfo(word: string): Observable<object> {
    let wordInfo = this.words[word];
    return wordInfo != null ? of(this.transformWordInfo(word, wordInfo)) : of(null);
  }

  getRandomWord(): Observable<string> {
    let words: string[] = Object.keys(this.words);
    return of(words[Math.floor(Math.random() * words.length)]);
  }

}
