import { Component, ViewChild, OnInit } from '@angular/core';

import { ModalComponent, SideMenuComponent } from '../../module/ui/ui';
import { WordInfoService } from '../../service/word-info.service';
import { DataRouterService } from '../../service/data-router.service';
import { WordDataContainer } from '../../model/word-data';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(ModalComponent) aboutModal: ModalComponent;
  @ViewChild(SideMenuComponent) menu: SideMenuComponent;
  wrongWord: string = null;
  wordToSearch: string;
  randomVerb: boolean;
  randomNominal: boolean;

  constructor(private wordInfoService: WordInfoService, private dataRouterService: DataRouterService){ }

  ngOnInit(): void {
    let randomVerb = localStorage.getItem('randomVerb');
    let randomNominal = localStorage.getItem('randomNominal');
    this.randomVerb = randomVerb == null ? true : randomVerb == 'true';
    this.randomNominal = randomNominal == null ? true : randomNominal == 'true';
    if(!this.randomNominal && !this.randomVerb){
      this.randomNominal = true;
      this.randomVerb = true;
    }
  }

  about = (): void => {
    this.aboutModal.show();
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
    let types = [];
    if(this.randomVerb){
      types.push("verb");
    }
    if(this.randomNominal){
      types.push("nominal");
    }
    this.wordInfoService.getRandomWord(types).subscribe((wordDataContainer: WordDataContainer) => {
      this.navigateWithWordDataContainer(wordDataContainer, language, 'test');
    });
  }

  openTutorial = (): void => {
    this.dataRouterService.navigate(["tutorial"]);
  }

  checkRandomOptions(verbClicked: boolean): void {
    if(!this.randomNominal && !this.randomVerb){
      if(verbClicked){
        this.randomNominal = true;
      }
      else{
        this.randomVerb = true;
      }
    }
    localStorage.setItem('randomVerb', String(this.randomVerb));
    localStorage.setItem('randomNominal', String(this.randomNominal));

  }
}
