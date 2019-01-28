import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

import { OppiComponent } from './oppi.component';
import { RoutingModule } from './routing.module';
import { WordInfoService, initWordInfoService } from './service/word-info.service';
import { DataRouterService } from './service/data-router.service';
import { I18nModule } from './module/i18n/i18n';
import { UiModule } from './module/ui/ui';
import { FiDeclensionService } from './service/fi-declension.service';
import { FiConjugationService } from './service/fi-conjugation.service';
import { FiSearchDeclensionComponent } from './component/fi/declension/fi-search-declension.component';
import { FiTestDeclensionComponent } from './component/fi/declension/fi-test-declension.component';
import { FiSearchConjugationComponent } from './component/fi/conjugation/fi-search-conjugation.component';
import { FiTestConjugationComponent } from './component/fi/conjugation/fi-test-conjugation.component';
import { UtilsService } from './service/utils.service';
import { TutorialComponent } from './component/tutorial/tutorial.component';
import { HomeComponent } from './component/home/home.component';
import { LanguageChangerComponent } from './component/language-changer/language-changer.component';
import { TutorialStartComponent } from './component/tutorial/start/tutorial-start.component';
import { TutorialSearchComponent } from './component/tutorial/search/tutorial-search.component';
import { TutorialTestComponent } from './component/tutorial/test/tutorial-test.component';
import { TutorialRandomComponent } from './component/tutorial/random/tutorial-random.component';
import { TutorialInfoComponent } from './component/tutorial/info/tutorial-info.component';
import { TutorialEndComponent } from './component/tutorial/end/tutorial-end.component';

@NgModule({
  declarations: [
    OppiComponent,
    HomeComponent,
    LanguageChangerComponent,
    FiSearchDeclensionComponent,
    FiTestDeclensionComponent,
    FiSearchConjugationComponent,
    FiTestConjugationComponent,
    TutorialComponent,
    TutorialStartComponent,
    TutorialSearchComponent,
    TutorialTestComponent,
    TutorialRandomComponent,
    TutorialInfoComponent,
    TutorialEndComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    RoutingModule,
    FormsModule,
    HttpClientModule,
    UiModule,
    I18nModule.forRoot('assets/i18n/', 'en', {'en': 'English', 'es': 'español', 'fi': 'suomi', 'fr': 'français', 'gl': 'galego', 'pt': 'português'})
  ],
  providers: [
    UtilsService,
    WordInfoService,
    {provide: APP_INITIALIZER, useFactory: initWordInfoService, deps: [WordInfoService], multi: true},
    DataRouterService,
    FiDeclensionService,
    FiConjugationService
  ],
  bootstrap: [OppiComponent]
})
export class OppiModule { }
