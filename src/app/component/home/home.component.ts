import { Component, ViewChild } from '@angular/core';

import { I18nService } from '../../module/i18n/i18n';
import { ModalComponent, SideMenuComponent } from '../../module/ui/ui';
import { WordInfoService } from '../../service/word-info.service';
import { DataRouterService } from '../../service/data-router.service';
import { WordDataContainer } from '../../model/word-data';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  @ViewChild(ModalComponent) helpModal: ModalComponent;
  @ViewChild(SideMenuComponent) menu: SideMenuComponent;
  wrongWord: string = null;
  wordToSearch: string;
  banners: string[];
  currentBanner: number;
  openBannerCounter: number;

  constructor(private wordInfoService: WordInfoService, private dataRouterService: DataRouterService){ }

  about = (): void => {
    //TODO: about modal 
    //this.helpModal.show();
    this.menu.hide();
  }

  searchWord(test?: boolean): void {
    this.wordToSearch = this.wordToSearch ? this.wordToSearch : '';
    let action: string = test ? 'test' : 'search';
    let language: string = 'fi';
    this.wordInfoService.getWordInfo(this.wordToSearch).subscribe((wordDataContainer: WordDataContainer) => {
      this.navigateWithWordDataContainer(wordDataContainer, language, action);
    }, (error) => {
      this.wrongWord = this.wordToSearch;
      this.dataRouterService.navigate(['/']);
    });
  }

  private navigateWithWordDataContainer(wordDataContainer: WordDataContainer, language: string, action: string): void {
    this.wrongWord = null;
    if(wordDataContainer.fiNominalData){
      this.wordToSearch = wordDataContainer.fiNominalData.word;
      this.dataRouterService.navigate([language, 'declension', action, this.wordToSearch], wordDataContainer.fiNominalData);
    } else {
      this.wordToSearch = wordDataContainer.fiVerbData.word;
      this.dataRouterService.navigate([language, 'conjugation', action, this.wordToSearch], wordDataContainer.fiVerbData);
    }
  }

  getRandomWord(): void {
    let language: string = 'fi';
    this.wordInfoService.getRandomWord().subscribe((wordDataContainer: WordDataContainer) => {
      this.navigateWithWordDataContainer(wordDataContainer, language, 'test');
    });
  }

  openTutorial = (): void => {
    this.dataRouterService.navigate(["tutorial"]);
  }
}
