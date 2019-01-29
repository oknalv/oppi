import { Component, OnInit } from '@angular/core';
import { DataRouterService } from '../../service/data-router.service';

@Component({
  selector: 'tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  slideNumber: number = 0;
  private LAST_SLIDE: number = 5;
  isFirst: boolean = true;
  isLast: boolean = false;
  movement: number = 0;
  private clicking: boolean = false;
  private clickBeginingX: number = null;
  private animationTimeout: number = 125;
  hidePage: boolean = false;

  constructor( private dataRouterService: DataRouterService ){}

  ngOnInit(): void {
    this.changeSlide();
  }

  changeSlide = (): void => {
    if(this.slideNumber > this.LAST_SLIDE){
      this.exit();
    }
    else{
      this.dataRouterService.navigate(['tutorial', String(this.slideNumber)]);
    }
  }

  exit = (): void => {
    this.dataRouterService.navigate(['/']);
  }

  next = (): void => {
    this.resetClicking();
    this.isFirst = false;
    this.movement = - window.innerWidth;
    setTimeout(() => {
      this.hidePage = true;
      this.movement = window.innerWidth;
      setTimeout(() => {
        this.hidePage = false;
        this.movement = 0;
        if(this.slideNumber <= this.LAST_SLIDE){
          this.slideNumber++;
          if(this.slideNumber == this.LAST_SLIDE){
            this.isLast = true;
          }
          this.changeSlide();
        }
      }, this.animationTimeout);
  }, this.animationTimeout);
  }

  previous = (): void => {
    this.resetClicking();
    this.movement = window.innerWidth;
    this.isLast = false;
    setTimeout(() => {
      this.hidePage = true;
      this.movement = - window.innerWidth;
      setTimeout(() => {
        this.hidePage = false;
        this.movement = 0;
        if(this.slideNumber > 0){
          this.slideNumber--;
          if(this.slideNumber == 0){
            this.isFirst = true;
          }
          this.changeSlide();
        }
      }, this.animationTimeout);
    }, this.animationTimeout);
  }
  
  private resetClicking(){
    this.clicking = false;
    this.clickBeginingX = null;
  }

  mousedown(event){
    this.clicking = true;
    this.clickBeginingX = this.getX(event);
  }

  mouseup(){
    if(Math.abs(this.movement) >= window.innerWidth / 3){
      if(this.movement > 0 && this.slideNumber > 0) {
        this.previous();
      }
      else if(this.movement < 0){
        this.next();
      }
      else {
        this.resetClicking();
        this.movement = 0;
      }
    }
    else {
      this.resetClicking();
      this.movement = 0;
    }
  }

  move(event): void {
    if(this.clicking){
      this.movement =  this.getX(event) - this.clickBeginingX;
    }
  }

  private getX(event){
    if(event.touches && event.touches){
      return event.touches[0].pageX;
    }
    return event.pageX;
  }

}
