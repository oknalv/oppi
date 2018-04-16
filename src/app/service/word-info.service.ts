import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { WordMetadata } from '../model/word-metadata';

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
        console.log("success");
        this.db = event.target.result;
        console.log(event);
        if(loadData){
          this.http.get('assets/data/nominals.json').subscribe(function(data){
            this.wordMetadata = new WordMetadata();
            this.wordMetadata.types = data['metadata']['types'];
            this.wordMetadata.type = data['metadata']['type'];
            this.wordMetadata.gradation = data['metadata']['gradation']
            this.wordMetadata.gradationTypes = data['metadata']['gradationTypes'];
            this.wordMetadata.vowelHarmony = data['metadata']['vowelHarmony'];
            this.wordMetadata.vowelHarmonyTypes[0] = data['metadata']['vowelHarmonyTypes']['0'] == 'frontVowel' ? ['ä', 'ö', 'y'] : ['a', 'o', 'u'];
            this.wordMetadata.vowelHarmonyTypes[1] = data['metadata']['vowelHarmonyTypes']['0'] == 'frontVowel' ? ['a', 'o', 'u'] : ['ä', 'ö', 'y'];
      
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
        console.log('upgradeNeeded');
        this.db = event.target.result;
        Array.from(this.db.objectStoreNames).forEach(function(name){
          this.db.deleteObjectStore(name);
        }.bind(this));
        let objectStore: IDBObjectStore = this.db.createObjectStore('fi', { keyPath:'id', autoIncrement: true});
        objectStore.createIndex('word', 'word', {unique: true});
        loadData = true;
      }.bind(this);
    }.bind(this));
  }

  private transformWordInfo(word: string, wordInfo: object, wordMetadata: WordMetadata, id: number): object{
    let transformedWordInfo: object = {'id': id, 'word': word, 'types': []};
    wordInfo[wordMetadata.types].forEach(function(wordType: object){
      let transformedWordType: object = {'type': wordType[wordMetadata.type]};
      if(Object.keys(wordType).indexOf(wordMetadata.gradation) > -1){
        transformedWordType['gradation'] = wordMetadata.gradationTypes[wordType[wordMetadata.gradation]];
      }
      transformedWordInfo['types'].push(transformedWordType);
    }.bind(this));
    if(Object.keys(wordInfo).indexOf(wordMetadata.vowelHarmony) > -1) {
      transformedWordInfo['vowelHarmony'] = wordMetadata.vowelHarmonyTypes[wordInfo[wordMetadata.vowelHarmony]];
    }
    else {
      transformedWordInfo['vowelHarmony'] = word.indexOf('a') > -1 || word.indexOf('o') > -1 || word.indexOf('u') > -1 ? ['a', 'o', 'u'] : ['ä', 'ö', 'y'];
    }
    return transformedWordInfo;
  }

  getWordInfo(word: string): Observable<object> {
    return this.idbrequestToObservable(this.db.transaction(['fi']).objectStore('fi').index('word').get(word));
  }

  getRandomWord(): Observable<string> {
    return this.idbrequestToObservable(this.db.transaction(['fi']).objectStore('fi').count()).flatMap(function(count: number){
      return this.idbrequestToObservable(this.db.transaction(['fi']).objectStore('fi').get(Math.floor(Math.random() * count)));
    }.bind(this));
  }

  private idbrequestToObservable(request: IDBRequest): Observable<any> {
    return Observable.create(function(observer: Observer<any>){
      request.onsuccess = function(event){
        observer.next(request.result);
        observer.complete();
      }
      request.onerror = function(event){
        observer.error(null);
      }
    }.bind(this));
  }

}
