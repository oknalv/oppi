import { Component } from '@angular/core';
import { TutorialSearchTestCommonComponent } from '../common/tutorial-search-test-common.component';

@Component({
  selector: 'tutorial-test',
  templateUrl: './tutorial-test.component.html',
  styleUrls: [
    '../../home/home.component.css',
    '../../fi/common.component.css',
    '../common/tutorial-common.component.css',
    './tutorial-test.component.css'
  ]
})
export class TutorialTestComponent extends TutorialSearchTestCommonComponent {
  startExplanationText = 'testExplanation';
  tableExplanationText = 'testTableExplanation';

  nominativeSingular: string = '';
  nominativePlural: string = '';
  nominativeSingularFocus: boolean = false;
  nominativePluralFocus: boolean = false;
  disabledAllButCheckButton: boolean = false;
  disabledAllButResetButton: boolean = false;
  actionCheckButton: boolean = false;
  actionResetButton: boolean = false;
  changeInputColors: boolean = false;

  constructor(){
    super();
    this.timeout += 2500 + 42500;
  }
  
  continue(): void { //10000
    setTimeout(() => {
      this.removeExplanation();
      this.fillNominativeSingular();
    }, this.stepTimeout * 20);
  };

  private fillNominativeSingular(): void { //1500
    setTimeout(() => {
      if(this.nominativeSingularFocus == false){
        this.nominativeSingularFocus = true;
        this.fillNominativeSingular();
      }
      else {
        if(this.nominativeSingular.length < 4){
          this.nominativeSingular = 'talo'.substring(0, this.nominativeSingular.length + 1);
          this.fillNominativeSingular();
        }
        else {
          this.nominativeSingularFocus = false;
          this.fillNominativePlural();
        }
      }
    }, this.stepTimeout / 2);
  }

  private fillNominativePlural(): void { //2000
    setTimeout(() => {
      if(this.nominativePluralFocus == false){
        this.nominativePluralFocus = true;
        this.fillNominativePlural();
      }
      else {
        if(this.nominativePlural.length < 6){
          this.nominativePlural = 'taloot'.substring(0, this.nominativePlural.length + 1);
          this.fillNominativePlural();
        }
        else {
          this.nominativePluralFocus = false;
          this.pressCheckButtonWithData()
        }
      }
    }, this.stepTimeout / 2);
  }

  private pressCheckButtonWithData(): void { //22000
    setTimeout(() => {
      this.addExplanation("testCheckCorrectData");
      setTimeout(() => {
        this.removeExplanation()
        setTimeout(() => {
          this.disabledAllButCheckButton = true;
          setTimeout(() => {
            this.pressCheckButton();
            setTimeout(() => {
              this.disabledAllButCheckButton = false;
              this.changeInputColors = true;
              this.pressResetForm();
            }, this.stepTimeout);
          }, this.stepTimeout);
        }, this.stepTimeout);
      }, this.stepTimeout * 40);
    }, this.stepTimeout);
  }

  private pressResetForm(): void { //7000
    setTimeout(() => {
      this.addExplanation("testResetForm");
      setTimeout(() => {
        this.removeExplanation();
        setTimeout(() => {
          this.disabledAllButResetButton = true;
          setTimeout(() => {
            this.pressResetButton();
            setTimeout(() => {
              this.disabledAllButResetButton = false;
              this.changeInputColors = false;
              this.nominativeSingular = '';
              this.nominativePlural = '';
            }, this.stepTimeout);
          }, this.stepTimeout);
        }, this.stepTimeout);
      }, this.stepTimeout * 10);
    }, this.stepTimeout);
  }

  private pressResetButton(): void {
    this.actionResetButton = true;
    setTimeout(() => {
      this.actionResetButton = false;
    }, 100);
  }

  private pressCheckButton(): void {
    this.actionCheckButton = true;
    setTimeout(() => {
      this.actionCheckButton = false;
    }, 100);
  }
  
  reset(): void {
    super.reset();
    this.nominativeSingular = '';
    this.nominativePlural = '';
    this.nominativeSingularFocus = false;
    this.nominativePluralFocus = false;
    this.disabledAllButCheckButton = false;
    this.disabledAllButResetButton = false;
    this.actionCheckButton = false;
    this.actionResetButton = false;
    this.changeInputColors = false;
  }
}
