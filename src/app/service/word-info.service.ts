import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { WordMetadata } from '../model/word-metadata';
import { FiDeclensionWordInfo, FiDeclensionType } from '../model/fi-declension-word-info';

@Injectable()
export class WordInfoService{
  private dbVersion: number = 1;
  private dbName: string = 'words';
  private db: IDBDatabase;
  private wordMetadata: WordMetadata;

  public a: number = 0;
  public o: number = 1;
  public u: number = 2;

  constructor(private http: HttpClient) { }

  initDb(): Promise<any> {
    return new Promise(function(resolve, reject){
      let dbRequest = window.indexedDB.open(this.dbName, this.dbVersion);
      let loadData: boolean = false;

      dbRequest.onerror = function(event){
        reject();
      }
      dbRequest.onsuccess = function(event){
        this.db = event.target.result;
        if(loadData){
          this.http.get('assets/data/nominals.json').subscribe(function(data){
            this.wordMetadata = this.getWordMetadata(data['metadata']);
            
            let transaction = this.db.transaction(['fi'],'readwrite');
            let objectStore = transaction.objectStore('fi');
            
            let observables: Observable<any>[] = [];
            Object.keys(data['words']).forEach(function(word: string, index: number){
              observables.push(this.idbrequestToObservable(objectStore.add(this.transformWordInfo(word, data['words'][word], this.wordMetadata, index))));
            }.bind(this));
            forkJoin(observables).subscribe(function(){
              resolve();
            }.bind(this));
          }.bind(this));
        } else {
          resolve();
        }
      }.bind(this);

      dbRequest.onupgradeneeded = function(event){
        loadData = true;
        this.db = event.target.result;
        Array.from(this.db.objectStoreNames).forEach(function(name){
          this.db.deleteObjectStore(name);
        }.bind(this));
        let objectStore: IDBObjectStore = this.db.createObjectStore('fi', { keyPath:'id', autoIncrement: true});
        objectStore.createIndex('word', 'word', {unique: true});
      }.bind(this);
    }.bind(this));
  }

  protected getWordMetadata(metadata: object): WordMetadata {
    let wordMetadata = new WordMetadata();
    wordMetadata.types = metadata['types'];
    wordMetadata.type = metadata['type'];
    wordMetadata.gradation = metadata['gradation']
    wordMetadata.gradationTypes = metadata['gradationTypes'];
    wordMetadata.vowelHarmony = metadata['vowelHarmony'];
    wordMetadata.vowelHarmonyTypes[0] = metadata['vowelHarmonyTypes']['0'] == 'frontVowel' ? ['ä', 'ö', 'y'] : ['a', 'o', 'u'];
    wordMetadata.vowelHarmonyTypes[1] = metadata['vowelHarmonyTypes']['0'] == 'frontVowel' ? ['a', 'o', 'u'] : ['ä', 'ö', 'y'];
    return wordMetadata
  }

  protected transformWordInfo(word: string, wordInfo: object, wordMetadata: WordMetadata, id: number): FiDeclensionWordInfo{
    let transformedWordInfo: FiDeclensionWordInfo = {'id': id, 'word': word, 'types': [], vowelHarmony: null};
    for(let wordType of wordInfo[wordMetadata.types]){
      let transformedWordType: FiDeclensionType = {'type': wordType[wordMetadata.type], gradation: null};
      if(wordMetadata.gradation in wordType){
        transformedWordType.gradation = wordMetadata.gradationTypes[wordType[wordMetadata.gradation]];
      }
      transformedWordInfo.types.push(transformedWordType);
    }
    if(wordMetadata.vowelHarmony in wordInfo) {
      transformedWordInfo.vowelHarmony = wordMetadata.vowelHarmonyTypes[wordInfo[wordMetadata.vowelHarmony]];
    }
    else {
      transformedWordInfo.vowelHarmony = word.includes('a') || word.includes('o') || word.includes('u') ? ['a', 'o', 'u'] : ['ä', 'ö', 'y'];
    }
    return transformedWordInfo;
  }

  getWordInfo(word: string): Observable<FiDeclensionWordInfo> {
    return this.idbrequestToObservable(this.db.transaction(['fi']).objectStore('fi').index('word').get(word), true);
  }

  getRandomWord(): Observable<FiDeclensionWordInfo> {
    return this.idbrequestToObservable(this.db.transaction(['fi']).objectStore('fi').count(), true).flatMap(function(count: number){
      return this.idbrequestToObservable(this.db.transaction(['fi']).objectStore('fi').get(Math.floor(Math.random() * count), true));
    }.bind(this));
  }

  private idbrequestToObservable(request: IDBRequest, dataNeeded?: boolean): Observable<any> {
    return Observable.create(function(observer: Observer<any>){
      request.onsuccess = function(event){
        if(dataNeeded && !request.result){
          observer.error(null);
        } else {
          observer.next(request.result);
          observer.complete();
        }
      }
      request.onerror = function(event){
        observer.error(null);
      }
    }.bind(this));
  }

}

export function initWordInfoService(wordInfoService: WordInfoService){
  return () => wordInfoService.initDb();
}
