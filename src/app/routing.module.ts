import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { FiSearchDeclensionComponent } from './component/fi/declension/fi-search-declension.component';
import { FiTestDeclensionComponent } from './component/fi/declension/fi-test-declension.component';
import { FiSearchConjugationComponent } from './component/fi/conjugation/fi-search-conjugation.component';
import { FiTestConjugationComponent } from './component/fi/conjugation/fi-test-conjugation.component';
import { TutorialComponent } from './component/tutorial/tutorial.component';
import { TutorialStartComponent } from './component/tutorial/start/tutorial-start.component';
import { TutorialSearchComponent } from './component/tutorial/search/tutorial-search.component';
import { TutorialTestComponent } from './component/tutorial/test/tutorial-test.component';
import { TutorialRandomComponent } from './component/tutorial/random/tutorial-random.component';
import { TutorialInfoComponent } from './component/tutorial/info/tutorial-info.component';
import { TutorialEndComponent } from './component/tutorial/end/tutorial-end.component';


const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: 'fi/declension/search/:word', component: FiSearchDeclensionComponent },
    { path: 'fi/declension/test/:word', component: FiTestDeclensionComponent },
    { path: 'fi/conjugation/search/:word', component: FiSearchConjugationComponent },
    { path: 'fi/conjugation/test/:word', component: FiTestConjugationComponent }
  ] },
  { path: 'tutorial', component: TutorialComponent, children: [
    { path: '0', component: TutorialStartComponent },
    { path: '1', component: TutorialSearchComponent },
    { path: '2', component: TutorialTestComponent },
    { path: '3', component: TutorialRandomComponent },
    { path: '4', component: TutorialInfoComponent },
    { path: '5', component: TutorialEndComponent }
  ] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
