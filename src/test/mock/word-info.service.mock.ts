import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { WordInfoService } from '../../app/service/word-info.service';
import * as words from '../../assets/data/nominals.json';
import { FiDeclensionWordInfo } from '../../app/model/fi-declension-word-info';

export class WordInfoServiceMock extends WordInfoService {


    getWordInfo(word: string): Observable<FiDeclensionWordInfo> {
      return Observable.create(function(observer: Observer<any>){
        if(!(word in words['words'])){
          observer.next(null);
        } else {
          observer.next(this.transformWordInfo(word, words['words'][word], this.getWordMetadata(words['metadata']), 0));
        }
        observer.complete();
      }.bind(this));
    }
  
  }