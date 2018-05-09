import { OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export abstract class Hider implements OnInit {
  hidden: boolean = true;
  hiding: boolean = false;
  private body: HTMLElement;
  //the same amount of time than in the --animation-time variable in the class fader in file '../css/ui.css'
  protected animationTime: number = 500;
  protected abstract classForTheBody: string;
  onHide: Subject<void> = new Subject();

  ngOnInit(){
    this.body = document.getElementsByTagName('body')[0];
  }

  show(): void {
    this.hidden = false;
    this.body.classList.add(this.classForTheBody);
  }

  hide(): void {
    this.hiding = true;
    this.body.classList.remove(this.classForTheBody);
    setTimeout(() => {
      this.hidden = true;
      this.hiding = false;
      this.onHide.next();
    }, this.animationTime);
  }

}