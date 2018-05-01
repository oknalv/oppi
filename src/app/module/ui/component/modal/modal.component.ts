import { Component } from '@angular/core';
import { Hidder } from '../hidder/hidder';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent extends Hidder {
  classForTheBody = 'modal-open';
}