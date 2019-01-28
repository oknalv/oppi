import { Component, OnInit } from '@angular/core';
import { DataRouterService } from '../../service/data-router.service';

@Component({
  selector: 'tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  private slideNumber: number = 0;
  private LAST_SLIDE: number = 5;
  isFirst: boolean = true;
  isLast: boolean = false;

  constructor( private dataRouterService: DataRouterService ){}
  ngOnInit(): void {
    this.changeSlide();
  }

  changeSlide = (): void => {
    this.dataRouterService.navigate(['tutorial', String(this.slideNumber)]);
  }

  exit = (): void => {
    this.dataRouterService.navigate(['/']);
  }

  next = (): void => {
    this.isFirst = false;
    if(this.slideNumber < this.LAST_SLIDE){
      this.slideNumber++;
      if(this.slideNumber == this.LAST_SLIDE){
        this.isLast = true;
      }
      this.changeSlide();
    }
  }

  previous = (): void => {
    this.isLast = false;
    if(this.slideNumber > 0){
      this.slideNumber--;
      if(this.slideNumber == 0){
        this.isFirst = true;
      }
      this.changeSlide();
    }
  }

}
