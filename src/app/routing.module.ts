import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeclineComponent } from './component/decline/decline.component';

const routes: Routes = [
  /*{ path: 'decline', component: DeclineComponent, }*/
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
