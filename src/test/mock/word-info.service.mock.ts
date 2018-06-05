import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { WordInfoService } from '../../app/service/word-info.service';
import * as nominals from '../../assets/data/fi/nominals.json';
import * as verbs from '../../assets/data/fi/verbs.json';
import { FiNominalData, WordDataContainer } from '../../app/model/word-data';

export class NominalWordInfoServiceMock extends WordInfoService {

  getWordInfo(word: string): Observable<WordDataContainer> {
    return Observable.create((observer: Observer<any>) => {
      if(!(word in nominals['words'])){
        observer.next(null);
      } else {
        observer.next({fiNominalData: this.transformFiNominal(word, nominals['words'][word], this.getFiNominalMetadata(nominals['metadata']), 0)});
      }
      observer.complete();
    });
  }

}

export class VerbWordInfoServiceMock extends WordInfoService {
  
  getWordInfo(word: string): Observable<WordDataContainer> {
    return Observable.create((observer: Observer<any>) => {
      if(!(word in verbs['words'])){
        observer.next(null);
      } else {
        observer.next({fiVerbData: this.transformFiVerb(word, verbs['words'][word], this.getFiVerbMetadata(verbs['metadata']), 0)});
      }
      observer.complete();
    });
  }

}