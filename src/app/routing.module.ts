import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FiSearchDeclensionComponent } from './component/fi/declension/fi-search-declension.component';
import { FiTestDeclensionComponent } from './component/fi/declension/fi-test-declension.component';
import { FiSearchConjugationComponent } from './component/fi/conjugation/fi-search-conjugation.component';
import { FiTestConjugationComponent } from './component/fi/conjugation/fi-test-conjugation.component';

const routes: Routes = [
  { path: 'fi/declension/search/:word', component: FiSearchDeclensionComponent },
  { path: 'fi/declension/test/:word', component: FiTestDeclensionComponent },
  { path: 'fi/conjugation/search/:word', component: FiSearchConjugationComponent },
  { path: 'fi/conjugation/test/:word', component: FiTestConjugationComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
