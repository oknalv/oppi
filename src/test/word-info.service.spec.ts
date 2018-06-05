import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { WordInfoService } from '../app/service/word-info.service';
import { FiNominalData, WordDataContainer } from '../app/model/word-data';

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
          service.getWordInfo('valo').map((wordDataContainer: WordDataContainer) => {
            let toCompare: WordDataContainer = new WordDataContainer();
            toCompare.fiNominalData = {'word': 'valo', 'id': wordDataContainer.fiNominalData['id'], 'types': [{'type': 1, 'gradation': null}], 'vowelHarmony': ['a', 'o', 'u']};
            expect(wordDataContainer).toEqual(toCompare);
          }),
          service.getWordInfo('palvelu').map((wordDataContainer: WordDataContainer) => {
            let toCompare: WordDataContainer = new WordDataContainer();
            toCompare.fiNominalData = {'word': 'palvelu', 'id': wordDataContainer.fiNominalData['id'], 'types': [{'type': 2, 'gradation': null}], 'vowelHarmony': ['a', 'o', 'u']}
            expect(wordDataContainer).toEqual(toCompare);
          }),
          service.getWordInfo('puu').map((wordDataContainer: WordDataContainer) => {
            let toCompare: WordDataContainer = new WordDataContainer();
            toCompare.fiNominalData = {'word': 'puu', 'id': wordDataContainer.fiNominalData['id'], 'types': [{'type': 18, 'gradation': null}], 'vowelHarmony': ['a', 'o', 'u']}
            expect(wordDataContainer).toEqual(toCompare);
          }),
          service.getWordInfo('teos').map((wordDataContainer: WordDataContainer) => {
            let toCompare: WordDataContainer = new WordDataContainer();
            toCompare.fiNominalData = {'word': 'teos', 'id': wordDataContainer.fiNominalData['id'], 'types': [{'type': 39, 'gradation': null}], 'vowelHarmony': ['a', 'o', 'u']}
            expect(wordDataContainer).toEqual(toCompare);
          }),
          service.getWordInfo('kaaos').map((wordDataContainer: WordDataContainer) => {
            let toCompare: WordDataContainer = new WordDataContainer();
            toCompare.fiNominalData = {'word': 'kaaos', 'id': wordDataContainer.fiNominalData['id'], 'types': [{'type': 39, 'gradation': null}], 'vowelHarmony': ['a', 'o', 'u']}
            expect(wordDataContainer).toEqual(toCompare);
          })
        ).subscribe(() => {
          done();
        }, (error) => {
          fail();
          done();
        });
      });
    })();
  });

  it('shoud fail when word doesn\'t exist', (done) => {
    inject([WordInfoService], (service: WordInfoService) => {
      service.initDb().then(() => {
        service.getWordInfo('asdasd').subscribe((wordInfo) => {
          fail();
          done();
        }, (error) => {
          expect(true).toBeTruthy();
          done();
        });
      });
    })();
  });
});
