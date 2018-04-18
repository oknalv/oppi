import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { WordInfoService } from '../app/service/word-info.service';

describe('WordInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WordInfoService]
    });
  });

  it('should be created', inject([WordInfoService], (service: WordInfoService) => {
    expect(service).toBeTruthy();
  }));

  it('shoud get word info correclty', (done) => {
    inject([WordInfoService], (service: WordInfoService) => {
      service.initDb().then(() => {
        forkJoin(
          service.getWordInfo('valo').map((wordInfo) => {
            expect(wordInfo).toEqual({'word': 'valo', 'id': wordInfo['id'], 'types': [{'type': 1}], 'vowelHarmony': ['a', 'o', 'u']});
          }),
          service.getWordInfo('palvelu').map((wordInfo) => {
            expect(wordInfo).toEqual({'word': 'palvelu', 'id': wordInfo['id'], 'types': [{'type': 2}], 'vowelHarmony': ['a', 'o', 'u']});
          }),
          service.getWordInfo('puu').map((wordInfo) => {
            expect(wordInfo).toEqual({'word': 'puu', 'id': wordInfo['id'], 'types': [{'type': 18}], 'vowelHarmony': ['a', 'o', 'u']});
          }),
          service.getWordInfo('teos').map((wordInfo) => {
            expect(wordInfo).toEqual({'word': 'teos', 'id': wordInfo['id'], 'types': [{'type': 39}], 'vowelHarmony': ['a', 'o', 'u']});
          }),
          service.getWordInfo('kaaos').map((wordInfo) => {
            expect(wordInfo).toEqual({'word': 'kaaos', 'id': wordInfo['id'], 'types': [{'type': 39}], 'vowelHarmony': ['a', 'o', 'u']});
          }),
          service.getWordInfo('asdasd').map((wordInfo) => {
            expect(wordInfo).toBeFalsy();
          })
        ).subscribe(() => {
          done();
        });
      });
    })();
  });
});
