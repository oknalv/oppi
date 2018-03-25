import { NgModule } from '@angular/core';
import { ModalComponent, ModalBodyComponent, ModalFooterComponent, ModalHeaderComponent } from './component/modal/modal';

@NgModule({
  declarations: [
    ModalComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalHeaderComponent
  ],
  exports: [
    ModalComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalHeaderComponent
  ]
})
export class UiModule {
}