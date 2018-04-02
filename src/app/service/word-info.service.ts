import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

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

  constructor(private http: HttpClient) { }

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
    return this.getWords().map(function(){
      let wordInfo = this.words[word];
      return wordInfo != null ? this.transformWordInfo(word, wordInfo) : null;
    }.bind(this));
  }

  getRandomWord(): Observable<string> {
    return this.getWords().map(function(){
      let words: string[] = Object.keys(this.words);
      return words[Math.floor(Math.random() * words.length)];
    }.bind(this));
  }

  private getWords(): Observable<any>{
    if(!this.words){
      return this.http.get('assets/data/nominals.json').map(function(data){
        this.words = data['words'];
        this.metadata = data['metadata'];
        this.types = data['metadata']['types'];
        this.type = data['metadata']['type'];
        this.gradation = data['metadata']['gradation'];
        this.gradationTypes = data['metadata']['gradationTypes'];
        this.vowelHarmony = data['metadata']['vowelHarmony']
        if(data['metadata']['vowelHarmonyTypes']['0'] == 'frontVowel'){
          this.vowelHarmonyTypes = {0: ['ä', 'ö', 'y'], 1: ['a', 'o', 'u']};
        } else {
          this.vowelHarmonyTypes = {1: ['ä', 'ö', 'y'], 0: ['a', 'o', 'u']};      
        }
      }.bind(this));
    }
    return of({});
  }

}
