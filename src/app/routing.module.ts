import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FiSearchDeclensionComponent } from './component/fi/fi-search-declension.component';
import { FiTestDeclensionComponent } from './component/fi/fi-test-declension.component';

const routes: Routes = [
  { path: 'search/:word', component: FiSearchDeclensionComponent },
  { path: 'test/:word', component: FiTestDeclensionComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
