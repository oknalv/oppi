import { Component } from '@angular/core';

@Component({
  selector: 'modal-body',
  template : `<ng-content></ng-content>`,
  styleUrls : ['./modal-part.component.css', './modal-body.component.css']
})
export class ModalBodyComponent{}