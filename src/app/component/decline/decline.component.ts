import { Component, ViewChild } from '@angular/core';
import { DeclesionService } from '../../service/declesion.service';
import { Declesion, DeclesionForm, DeclesionString } from '../../model/declesion';
import { WordInfoService } from '../../service/word-info.service';
import { ModalComponent, ModalHeaderComponent, ModalBodyComponent } from '../../module/ui/ui';

@Component({
  selector: 'decline',
  templateUrl: './decline.component.html',
  styleUrls: ['./decline.component.css']
})
export class DeclineComponent {

  private declesions: Declesion[];
  private declesionToCheck: DeclesionString;
  private cases: string[];
  private word: string;
  private numbers: string[];
  private declesionErrors: object;
  @ViewChild(ModalComponent) helpModal: ModalComponent;
  wordToSearch: string;
  test: boolean;
  error: number;

  constructor(private declesionService: DeclesionService, private wordInfoService: WordInfoService) { }

  searchWord(wordToSearch: string, test?: boolean): void {
    this.word = wordToSearch;
    this.declesionToCheck = new DeclesionString();
    this.declesionErrors = null;
    this.declesionService.decline(this.word).subscribe(function(declesions: Declesion[]){
      this.error = null;
      this.declesions = declesions;
      this.numbers = Object.keys(this.declesions[0]);
      this.cases = Object.keys(this.declesions[0][this.numbers[0]]);
      this.declesionErrors = null;
      this.test = test == true;
    }.bind(this), function(error){
      this.error = error;
      this.declesions = null;
      this.cases = null;
      this.declesionErrors = null;
      this.test = false;
    }.bind(this));

  }

  check(): void{
    this.declesionErrors = null;
    this.declesionService.decline(this.word).subscribe(function(declesions: Declesion[]){
      declesions.forEach(function(declesion: Declesion){
        if(!this.declesionErrors || this.declesionErrors['numberOfErrors'] > 0){
          let declesionToCheckAux = this.declesionStringToDeclesion(this.declesionToCheck);
          let declesionErrorsAux = this.compareDeclesions(declesion, declesionToCheckAux);
          if(!this.declesionErrors || this.declesionErrors['numberOfErrors'] > declesionErrorsAux['numberOfErrors']){
            this.declesionErrors = declesionErrorsAux;
          }
        }
      }.bind(this));
      
    }.bind(this));
  }

  private compareDeclesions(correctDeclesion: Declesion, declesionToCheck: Declesion): object {
    let declesionErrors = {'numberOfErrors': 0};
    Object.keys(correctDeclesion).forEach(function(numberName){
      let numberForm: DeclesionForm = correctDeclesion[numberName];
      Object.keys(numberForm).forEach(function(caseName){
        let caseForms: string[] = numberForm[caseName];
        let checkCaseForms: string[] = declesionToCheck[numberName][caseName];
        let isContained: boolean =
          !(caseForms.length > 0 && checkCaseForms.length == 0) &&
          !(caseForms.length == 0 && checkCaseForms.length > 0) &&
          caseForms.filter(function(caseForm){
            return checkCaseForms.includes(caseForm);
          }.bind(this)).length == checkCaseForms.length;
        if(!(numberName in declesionErrors)){
          declesionErrors[numberName] = {};
        }
        if(!isContained){
          declesionErrors['numberOfErrors']++;
          declesionErrors[numberName][caseName] = true;
        }
        else {
          declesionErrors[numberName][caseName] = false;
        }
      }.bind(this));
    }.bind(this));
    return declesionErrors;
  }

  private declesionStringToDeclesion(declesionString: DeclesionString): Declesion {
    let declesion: Declesion = new Declesion();
    Object.keys(declesionString).forEach(function(numberName){
      Object.keys(declesionString[numberName]).forEach(function(caseName){
        declesion[numberName][caseName] =
          declesionString[numberName][caseName] != null && declesionString[numberName][caseName] != '' ?
          declesionString[numberName][caseName].split(',').map((caseForm: string) => caseForm.trim()).sort() :
          declesion[numberName][caseName];
      }.bind(this));
    }.bind(this));
    return declesion;
  }

  getRandomWord(): void {
    this.wordInfoService.getRandomWord().subscribe(function(word){
      this.wordToSearch = word.word;
      this.searchWord(this.wordToSearch, true);
    }.bind(this));
  }

  help(): void {
    this.helpModal.show();
  }

}
