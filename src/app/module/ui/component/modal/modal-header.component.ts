import { Component, Inject, forwardRef } from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'modal-header',
  templateUrl : './modal-header.component.html',
  styleUrls : ['./modal-part.component.css', './modal-header.component.css']
})
export class ModalHeaderComponent{

  constructor(@Inject(forwardRef(() => ModalComponent)) private modal: ModalComponent){}

  hide(){
    this.modal.hide();
  }
}