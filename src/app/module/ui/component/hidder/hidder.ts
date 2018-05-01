import { OnInit } from "@angular/core";

export abstract class Hidder implements OnInit {
  hidden: boolean = true;
  hidding: boolean = false;
  private body: HTMLElement;
  //the same amount of time than in the --animation-time variable in the class fader in file '../css/ui.css'
  protected animationTime: number = 500;
  protected abstract classForTheBody: string;

  ngOnInit(){
    this.body = document.getElementsByTagName('body')[0];
  }

  show(): void {
    this.hidden = false;
    this.body.classList.add(this.classForTheBody);
  }

  hide(): void {
    this.hidding = true;
    this.body.classList.remove(this.classForTheBody);
    setTimeout(() => {
      this.hidden = true;
      this.hidding = false;
    }, this.animationTime);
  }

}