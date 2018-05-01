import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  hidden: boolean = true;
  private body: HTMLElement;

  constructor(){};

  ngOnInit(){
    this.body = document.getElementsByTagName('body')[0];
  }

  show(): void {
    this.hidden = false;
    this.body.classList.add('modal-open');
  }

  hide(): void {
    this.hidden = true;
    this.body.classList.remove('modal-open');
  }
}