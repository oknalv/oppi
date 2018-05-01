import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ModalBodyComponent, ModalFooterComponent, ModalHeaderComponent } from './component/modal/modal';
import { SideMenuComponent } from './component/side-menu/side-menu';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    SideMenuComponent
  ],
  exports: [
    ModalComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    SideMenuComponent
  ]
})
export class UiModule {
}