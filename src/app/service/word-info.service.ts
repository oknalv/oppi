import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { FiVerbMetadata, FiNominalMetadata } from '../model/fi-metadata';
import { FiNominalData, FiVerbData, FiWordType, WordData, WordDataContainer, FiWordData } from '../model/word-data';

/**
 * The service which stores and retrieves the word data from de IndexedDB.
 */
@Injectable()
export class WordInfoService{
  private dbVersion: number = 2;
  private dbName: string = 'words';
  private fiNominalsObjectStoreName: string = 'fi-nominals';
  private fiVerbsObjectStoreName: string = 'fi-verbs';
  private db: IDBDatabase;

  constructor(private http: HttpClient) { }

  /**
   * Creates the database and its object stores if it not exists
   * or deletes and creates again all the object stores of the database if it needs an update
   * and finally opens the database.
   * 
   * @returns A promise that resolves if the database is opened or rejects if it is not.
   */
  initDb(): Promise<any> {
    return new Promise((resolve, reject) => {
      let dbRequest: IDBOpenDBRequest = window.indexedDB.open(this.dbName, this.dbVersion);
      let loadData: boolean = false;

      /**
       * The type of event is any because these functions expect to receive a Event type object
       * with the Event.target attribute of type EventTarget, and result attribute doesn't exists in EventTarget type.
       */

      dbRequest.onerror = (event: any) => {
        reject();
      }

      dbRequest.onsuccess = (event: any) => {
        this.db = event.target.result;
        if(loadData){
          //Load Finnish nominals
          forkJoin(this.http.get('assets/data/fi/nominals.json').flatMap((data) => {
            let fiNominalMetadata: FiNominalMetadata = this.getFiNominalMetadata(data['metadata']);
            
            //let transaction = this.db.transaction([this.fiNominalsObjectStoreName],'readwrite');
            let objectStore = this.getObjectStore(this.fiNominalsObjectStoreName, 'readwrite');
            
            let observables: Observable<any>[] = [];
            Object.keys(data['words']).forEach((word: string, index: number) => {
              observables.push(this.idbrequestToObservable(objectStore.add(this.transformFiNominal(word, data['words'][word], fiNominalMetadata, index))));
            });
            return forkJoin(observables);
          }),
          //Load Finnish verbs
          this.http.get('assets/data/fi/verbs.json').flatMap((data) => {
            let fiVerbMetadata: FiVerbMetadata = this.getFiVerbMetadata(data['metadata']);
            
            let objectStore: IDBObjectStore = this.getObjectStore(this.fiVerbsObjectStoreName, 'readwrite');
            
            let observables: Observable<any>[] = [];
            Object.keys(data['words']).forEach((word: string, index: number) => {
              observables.push(this.idbrequestToObservable(objectStore.add(this.transformFiVerb(word, data['words'][word], fiVerbMetadata, index))));
            });
            return forkJoin(observables);
          })).subscribe(() => {
            resolve();
          });
        } else {
          resolve();
        }
      };

      dbRequest.onupgradeneeded = (event: any) => {
        loadData = true;
        this.db = event.target.result;
        Array.from(this.db.objectStoreNames).forEach(function(name){
          this.db.deleteObjectStore(name);
        }.bind(this));
        this.createObjectStore(this.fiNominalsObjectStoreName);
        this.createObjectStore(this.fiVerbsObjectStoreName);
      };
    });
  }

  /**
   * Creates an object store with the id 'id', which is used for getting a random word,
   * and adds the index 'word' to the attribute word used for searching by word.
   * 
   * @param objectStoreName It is the name of he object store to be created.
   */
  private createObjectStore(objectStoreName: string): void{
    let objectStore: IDBObjectStore = this.db.createObjectStore(objectStoreName, { keyPath:'id', autoIncrement: true});
    objectStore.createIndex('word', 'word', {unique: true});
  }

  /**
   * Gets the Finnish nominal attributes metadata from the `metadata` plain object, for later word creation from the simplified attributes word files.
   * Those attributes are simplified to have a smaller file in the server.
   * 
   * @param metadata  The metadata plain object.
   * @returns The Finnish nominal attribute metadata object.
   */
  protected getFiNominalMetadata(metadata: object): FiNominalMetadata {
    let fiNominalMetadata: FiNominalMetadata = new FiNominalMetadata();
    fiNominalMetadata.types = metadata['types'];
    fiNominalMetadata.type = metadata['type'];
    fiNominalMetadata.gradation = metadata['gradation']
    fiNominalMetadata.gradationTypes = metadata['gradationTypes'];
    fiNominalMetadata.vowelHarmony = metadata['vowelHarmony'];
    fiNominalMetadata.vowelHarmonyTypes[0] = metadata['vowelHarmonyTypes']['0'] == 'frontVowel' ? ['ä', 'ö', 'y'] : ['a', 'o', 'u'];
    fiNominalMetadata.vowelHarmonyTypes[1] = metadata['vowelHarmonyTypes']['0'] == 'frontVowel' ? ['a', 'o', 'u'] : ['ä', 'ö', 'y'];
    return fiNominalMetadata;
  }


  /**
   * Gets the Finnish verb attributes metadata from the `metadata` plain object, for later word creation from the simplified attributes word files.
   * Those attributes are simplified to have a smaller file in the server.
   * 
   * @param metadata The metadata plain object.
   * @returns The Finnish verb attribute metadata.
   */
  protected getFiVerbMetadata(metadata: object): FiVerbMetadata {
    let fiVerbMetadata = new FiVerbMetadata();
    fiVerbMetadata.types = metadata['types'];
    fiVerbMetadata.type = metadata['type'];
    fiVerbMetadata.gradation = metadata['gradation']
    fiVerbMetadata.gradationTypes = metadata['gradationTypes'];
    return fiVerbMetadata;
  }

  /**
   * Transforms the simplified attributes nominal plain object `fiNominalData` to a FiNominalData object.
   * 
   * @param word The nominal.
   * @param fiNominalData The nominal data plain object.
   * @param fiNominalMetadata THe nominal metadata.
   * @param id An id for random search.
   * @returns The FiNominalData object.
   */
  protected transformFiNominal(word: string, fiNominalData: object, fiNominalMetadata: FiNominalMetadata, id: number): FiNominalData{
    let transformedNominalData: FiNominalData = {'id': id, 'word': word, 'types': [], vowelHarmony: null};
    for(let wordType of fiNominalData[fiNominalMetadata.types]){
      let transformedWordType: FiWordType = {'type': wordType[fiNominalMetadata.type], gradation: null};
      if(fiNominalMetadata.gradation in wordType){
        transformedWordType.gradation = fiNominalMetadata.gradationTypes[wordType[fiNominalMetadata.gradation]];
      }
      transformedNominalData.types.push(transformedWordType);
    }
    if(fiNominalMetadata.vowelHarmony in fiNominalData) {
      transformedNominalData.vowelHarmony = fiNominalMetadata.vowelHarmonyTypes[fiNominalData[fiNominalMetadata.vowelHarmony]];
    }
    else {
      transformedNominalData.vowelHarmony = word.includes('a') || word.includes('o') || word.includes('u') ? ['a', 'o', 'u'] : ['ä', 'ö', 'y'];
    }
    return transformedNominalData;
  }

  /**
   * Transforms the simplified attributes nominal plain object `fiNominalData` to a FiNominalData object.
   * 
   * @param word The nominal.
   * @param fiVerbData The nominal data plain object.
   * @param fiVerbMetadata THe nominal metadata.
   * @param id An id for random search.
   * @returns The FiNominalData object.
   */
  protected transformFiVerb(word: string, fiVerbData: object, fiVerbMetadata: FiVerbMetadata, id: number): FiVerbData{
    let transformedNominalData: FiVerbData = {'id': id, 'word': word, 'types': []};
    for(let wordType of fiVerbData[fiVerbMetadata.types]){
      let transformedWordType: FiWordType = {'type': wordType[fiVerbMetadata.type], gradation: null};
      if(fiVerbMetadata.gradation in wordType){
        transformedWordType.gradation = fiVerbMetadata.gradationTypes[wordType[fiVerbMetadata.gradation]];
      }
      transformedNominalData.types.push(transformedWordType);
    }
    return transformedNominalData;
  }

  /**
   * Gets an object that contains the different objects that implement WordData from the database by the given `word` param.
   * 
   * @param word The word used to search in the database.
   * @returns An observable that contains a WordDataContainer.
   */
  getWordInfo(word: string): Observable<WordDataContainer> {
    return Observable.create((observer: Observer<any>) => {
      forkJoin(this.getFiNominal(word), this.getFiVerb(word), (fiNominalData: FiNominalData, fiVerbData: FiVerbData) => {
        let data: WordDataContainer = new WordDataContainer();
        if(fiNominalData){
          data.fiNominalData = fiNominalData;
        }
        if(fiVerbData){
          data.fiVerbData = fiVerbData;
        }
        if(Object.keys(data).length > 0){
          observer.next(data);
          observer.complete();
        } else {
          observer.error(null);
        }
      }).subscribe();
      
    })
  }

  /**
   * Gets a FiNominalData object from the database by the given `nominal` param.
   * 
   * @param nominal The Finnish nominal used to search in the database.
   * @returns An observable that contains the FiNominalData object.
   */
  private getFiNominal(nominal: string): Observable<FiNominalData> {
    return this.idbrequestToObservable(this.getObjectStore(this.fiNominalsObjectStoreName).index('word').get(nominal));
  }

  /**
   * Gets a FiVerbData object from the database by the given `verb` param.
   * 
   * @param verb The Finnish verb used to search in the database.
   * @returns An observable that contains the FiVerbData object.
   */
  private getFiVerb(verb: string): Observable<FiVerbData> {
    return this.idbrequestToObservable(this.getObjectStore(this.fiVerbsObjectStoreName).index('word').get(verb));
  }

  /**
   * Gets a WordDataContainer object with a random word from the database.
   * 
   * @param types The types of word chosen to get a random word from.
   * @returns An observable that contains the WordDataContainer object.
   */
  getRandomWord(types: string[]): Observable<WordDataContainer> {
    let objectStoreNames: string[] = [];
    if(types.includes('verb')){
      objectStoreNames.push(this.fiVerbsObjectStoreName);
    }
    if(types.includes('nominal')){
      objectStoreNames.push(this.fiNominalsObjectStoreName);
    }
    console.log(types);
    let randomNumber: number = Math.floor(Math.random() * objectStoreNames.length);
    let objectStoreName: string = objectStoreNames[randomNumber];
    let objectStore: IDBObjectStore = this.getObjectStore(objectStoreName);
    return this.idbrequestToObservable(objectStore.count()).flatMap((count: number) => {
      return this.idbrequestToObservable(objectStore.get(Math.floor(Math.random() * count))).map((fiWordData: FiWordData) => {
        console.log(fiWordData);
        let data: WordDataContainer = new WordDataContainer();
        switch(objectStoreName){
          case this.fiNominalsObjectStoreName:
          data.fiNominalData = <FiNominalData> fiWordData;
          break;
          case this.fiVerbsObjectStoreName:
          data.fiVerbData = <FiVerbData> fiWordData;
          break;
        }
        return data;
      });
    });
  }

  /**
   * Gets an object store.
   * 
   * @param name The name of the object store. 
   * @param mode The access mode ('readonly', 'readwrite').
   * @returns The object store.
   */
  private getObjectStore(name: string, mode?: IDBTransactionMode) {
    let idbMode: IDBTransactionMode = mode != 'readwrite' ? 'readonly' : 'readwrite';
    return this.db.transaction([name], idbMode).objectStore(name);
  }

  /**
   * Transforms a IDBRequest to an Observable.
   * 
   * @param request The IDBRequest. 
   * @param dataNeeded A flag to specify that this method must return data. It will fail if it doesn't.
   * @returns The Observable;
   */
  private idbrequestToObservable(request: IDBRequest): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      request.onsuccess = (event) => {
        observer.next(request.result);
        observer.complete();
      }
      request.onerror = (event) => {
        observer.error(null);
      }
    });
  }

}

/**
 * Inits the WordInfoService, it makes this app to wait for this service to get all the data in the IndexedDB.
 * 
 * @param wordInfoService  The WordInfoService that will init.
 * @returns A function that inits the service.
 */
export function initWordInfoService(wordInfoService: WordInfoService): Function {
  return () => wordInfoService.initDb();
}
