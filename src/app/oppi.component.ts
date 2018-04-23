import { Component, OnInit, ViewChild } from '@angular/core';

import { I18nService } from './module/i18n/i18n';
import { ModalComponent } from './module/ui/ui'
import { WordInfoService } from './service/word-info.service';
import { DataRouterService } from './service/data-router.service';
import { FiDeclensionWordInfo } from './model/fi-declension-word-info';

@Component({
  selector: 'oppi',
  templateUrl: './oppi.component.html',
  styleUrls: ['./oppi.component.css']
})
export class OppiComponent implements OnInit {
  currentLanguageKey: string;
  languageKeys: string[];
  private languages: object;
  @ViewChild(ModalComponent) helpModal: ModalComponent;
  wrongWord: string = null;
  wordToSearch: string;

  constructor(private i18nService: I18nService, private wordInfoService: WordInfoService, private dataRouterService: DataRouterService){ }

  ngOnInit(): void {
    this.languages = this.i18nService.getLanguageKeys();
    this.languageKeys = Object.keys(this.languages);
    this.currentLanguageKey = this.i18nService.getCurrentLanguageKey();
  }

  changeLanguage(): void {
    this.i18nService.changeLanguage(this.currentLanguageKey);
  }

  help(){
    this.helpModal.show();
  }

  searchWord(test?: boolean): void {
    this.wordToSearch = this.wordToSearch ? this.wordToSearch : '';
    let action: string = test ? 'test' : 'search';
    this.wordInfoService.getWordInfo(this.wordToSearch).subscribe((wordData: FiDeclensionWordInfo) => {
      this.wrongWord = null;
      this.dataRouterService.navigate([action, wordData.word], {word: wordData});
    }, (error) => {
      this.wrongWord = this.wordToSearch;
      this.dataRouterService.navigate(['/']);
    });
  }

  getRandomWord(): void {
    this.wordInfoService.getRandomWord().subscribe((wordData: FiDeclensionWordInfo) => {
      this.wrongWord = null;
      this.wordToSearch = wordData.word;
      this.dataRouterService.navigate(['test', wordData.word], {word: wordData});
    });
  }

}
