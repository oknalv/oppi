import { TestBed, inject } from '@angular/core/testing';

import { WordInfoService } from '../app/service/word-info.service';

describe('WordInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordInfoService]
    });
  });

  it('should be created', inject([WordInfoService], (service: WordInfoService) => {
    expect(service).toBeTruthy();
  }));

  it('shoud get word info correclty', inject([WordInfoService], (service: WordInfoService) => {
    service.getWordInfo('valo').subscribe((wordInfo) => {
      expect(wordInfo).toEqual({'types': [{'type': 1}], 'vowelHarmony': ['a', 'o', 'u']});
    });
    service.getWordInfo('palvelu').subscribe((wordInfo) => {
      expect(wordInfo).toEqual({'types': [{'type': 2}], 'vowelHarmony': ['a', 'o', 'u']});
    });
    service.getWordInfo('puu').subscribe((wordInfo) => {
      expect(wordInfo).toEqual({'types': [{'type': 18}], 'vowelHarmony': ['a', 'o', 'u']});
    });
    service.getWordInfo('teos').subscribe((wordInfo) => {
      expect(wordInfo).toEqual({'types': [{'type': 39}], 'vowelHarmony': ['a', 'o', 'u']});
    });
    service.getWordInfo('kaaos').subscribe((wordInfo) => {
      expect(wordInfo).toEqual({'types': [{'type': 39}], 'vowelHarmony': ['a', 'o', 'u']});
    });
  }))
});
