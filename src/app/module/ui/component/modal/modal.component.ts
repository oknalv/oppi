import { Component } from '@angular/core';
import { Hider } from '../hider/hider';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent extends Hider {
  classForTheBody = 'modal-open';
}