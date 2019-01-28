import { OnInit, OnDestroy } from '@angular/core';

export abstract class TutorialCommonComponent implements OnInit, OnDestroy {
  protected abstract timeout: number;
  private stop: boolean = false;
  protected stepTimeout: number = 500;
  showExplanation: boolean = false;
  explanation: string = "";
  actionButton: boolean = false;

  ngOnInit(): void {
    this.loop()
  }

  private loop(): void {
    this.doAnimation();
    setTimeout(() => {
      this.removeExplanation();
      setTimeout(() => {
        if(!this.stop){
          this.loop();
        }
      }, this.stepTimeout);
    }, this.timeout - this.stepTimeout);
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  protected stopLoop(): void {
    this.stop = true;
  }

  protected addExplanation(explanation): void {
    this.explanation = explanation;
    this.showExplanation = true;
  }
  protected removeExplanation(): void {
    this.showExplanation = false;
  }

  protected pressButton(): void {
    this.actionButton = true;
    setTimeout(() => {
      this.actionButton = false;
    }, 100);
  }

  protected abstract doAnimation(): void;

}