import { Component } from '@angular/core';
import { TutorialCommonComponent } from '../common/tutorial-common.component';

@Component({
  selector: 'tutorial-random',
  templateUrl: './tutorial-random.component.html',
  styleUrls: [
    '../../home/home.component.css',
    '../../fi/common.component.css',
    '../common/tutorial-common.component.css',
    './tutorial-random.component.css'
  ]
})
export class TutorialRandomComponent extends TutorialCommonComponent {
  timeout = 2500 + 17500;

  disabledButtons: boolean = false;
  wordToSearch: string = '';

  doAnimation(): void { //11500
    this.reset();
    setTimeout(() => {
      this.addExplanation('randomExplanation');
      setTimeout(() => {
        this.removeExplanation();
        this.randomize();
      }, this.stepTimeout * 22);
    }, this.stepTimeout);
  };

  private randomize(): void { //5500
    setTimeout(() => {
      this.disabledButtons = true;
      setTimeout(() => {
        this.pressButton();
        setTimeout(() => {
          this.wordToSearch = 'oppia';
          setTimeout(() => {
            this.pressButton();
            setTimeout(() => {
              this.wordToSearch = 'suomi'
              setTimeout(() => {
                this.pressButton();
                setTimeout(() => {
                  this.wordToSearch = 'syödä';
                  setTimeout(() => {
                    this.pressButton();
                    setTimeout(() => {
                      this.wordToSearch = 'kahvi';
                      setTimeout(() => {
                        this.disabledButtons = false;
                      }, this.stepTimeout);
                    }, this.stepTimeout * 2);
                  }, 100);
                }, this.stepTimeout * 2 - 100);
              }, 100);
            }, this.stepTimeout * 2 - 100);
          }, 100);
        }, this.stepTimeout * 2 - 100);
      }, this.stepTimeout);
    }, this.stepTimeout);
  }

  private reset(): void {
    this.disabledButtons = false;
    this.wordToSearch = '';
  }
}
