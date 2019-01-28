import { TutorialCommonComponent } from '../common/tutorial-common.component';

export abstract class TutorialSearchTestCommonComponent extends TutorialCommonComponent {
  protected abstract startExplanationText: string;
  protected abstract tableExplanationText: string;

  timeout = 15500;
  wordToSearch: string = "";
  searchTable: boolean = false;
  disabledButtons: boolean = false;
  focusInput: boolean = false;

  doAnimation(): void { //11000
    this.reset();
    setTimeout(() => {
      this.addExplanation(this.startExplanationText);
      setTimeout(() => {
        this.removeExplanation();
        setTimeout(() => {
          this.focusInput = true;
          this.writeTalo();
        }, this.stepTimeout);
      }, this.stepTimeout * 20);
    }, this.stepTimeout);
  }

  private writeTalo(): void { //2500
    setTimeout(() => {
      if(this.wordToSearch.length < 4){
        this.wordToSearch = 'talo'.substring(0, this.wordToSearch.length + 1);
        this.writeTalo();
      }
      else {
        this.focusInput = false;
        this.clickSearch();
      }
    }, this.stepTimeout);
  }

  private clickSearch(): void { //1500
    setTimeout(() => {
      this.disabledButtons = true;
      setTimeout(() => {
        this.pressButton();
        setTimeout(() => {
          this.disabledButtons = false;
          this.searchTable = true;
          this.tableExplanation();
        }, this.stepTimeout);
      }, this.stepTimeout);
    }, this.stepTimeout);
  }

  private tableExplanation(): void { //500
    setTimeout(() => {
      this.addExplanation(this.tableExplanationText);
      this.continue();
    }, this.stepTimeout);
  }

  protected reset(): void {
    this.disabledButtons = false;
    this.wordToSearch = '';
    this.searchTable = false;
    this.focusInput = false;
  }

  protected abstract continue(): void;

}
