import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { I18nService } from './module/i18n/i18n';
import { ModalComponent, SideMenuComponent } from './module/ui/ui';
import { WordInfoService } from './service/word-info.service';
import { DataRouterService } from './service/data-router.service';
import { FiDeclensionWordInfo } from './model/fi-declension-word-info';

@Component({
  selector: 'oppi',
  templateUrl: './oppi.component.html',
  styleUrls: ['./oppi.component.css']
})
export class OppiComponent implements OnInit, OnDestroy {
  currentLanguageKey: string;
  languageKeys: string[];
  private languages: object;
  @ViewChild(ModalComponent) helpModal: ModalComponent;
  @ViewChild(SideMenuComponent) optionsMenu: SideMenuComponent;
  wrongWord: string = null;
  wordToSearch: string;
  banners: string[];
  currentBanner: number;
  openBannerCounter: number;

  constructor(private i18nService: I18nService, private wordInfoService: WordInfoService, private dataRouterService: DataRouterService){ }

  ngOnInit(): void {
    this.languages = this.i18nService.getLanguageKeys();
    this.languageKeys = Object.keys(this.languages);
    this.currentLanguageKey = this.i18nService.getCurrentLanguageKey();
    this.banners = ['banner', 'space', 'babel'];
    this.currentBanner = 0;
    this.openBannerCounter = 0;
    this.optionsMenu.onHide.subscribe(() => {
      this.currentBanner = 0;
    })
  }

  ngOnDestroy(): void {
    this.optionsMenu.onHide.unsubscribe();
  }

  changeLanguage(): void {
    this.i18nService.changeLanguage(this.currentLanguageKey);
    this.optionsMenu.hide();
  }

  help(){
    this.helpModal.show();
    this.optionsMenu.hide();
  }

  searchWord(test?: boolean): void {
    this.wordToSearch = this.wordToSearch ? this.wordToSearch : '';
    let action: string = test ? 'test' : 'search';
    this.wordInfoService.getWordInfo(this.wordToSearch).subscribe((wordData: FiDeclensionWordInfo) => {
      this.wrongWord = null;
      this.dataRouterService.navigate([action, wordData.word], wordData);
    }, (error) => {
      this.wrongWord = this.wordToSearch;
      this.dataRouterService.navigate(['/']);
    });
  }

  getRandomWord(): void {
    this.wordInfoService.getRandomWord().subscribe((wordData: FiDeclensionWordInfo) => {
      this.wrongWord = null;
      this.wordToSearch = wordData.word;
      this.dataRouterService.navigate(['test', wordData.word], wordData);
    });
  }

  clickBanner(event: MouseEvent): void {
    let x: number = event.offsetX, y: number = event.offsetY;
    switch(this.currentBanner){
      case 0:
      this.openBannerCounter++;
      if(this.openBannerCounter < 3){
        setTimeout(() => {
          this.openBannerCounter = 0;
        }, 500);
      } else {
        this.openBannerCounter = 0;
        this.currentBanner++;
      }
      break;
      case 1:
      //oringin (152, 26), radius 15
      let difference: number = Math.sqrt((152 - x) * (152 - x) + (26 - y) * (26 - y));
      if( difference <= 15){
        this.currentBanner++;
        break;
      }
      default:
      this.optionsMenu.hide();
      break;
    }
  }

}
