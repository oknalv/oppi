import { Component } from '@angular/core';
import { TutorialSearchTestCommonComponent } from '../common/tutorial-search-test-common.component';

@Component({
  selector: 'tutorial-search',
  templateUrl: './tutorial-search.component.html',
  styleUrls: [
    '../../home/home.component.css',
    '../../fi/common.component.css',
    '../common/tutorial-common.component.css',
    './tutorial-search.component.css'
  ]
})
export class TutorialSearchComponent extends TutorialSearchTestCommonComponent {
  startExplanationText = 'searchExplanation';
  tableExplanationText = 'searchTableExplanation';

  constructor(){
    super();
    this.timeout += 7000;
  }

  continue(): void {};
}
