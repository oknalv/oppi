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
import { FiSearchDeclensionComponent } from './component/fi/fi-search-declension.component';
import { FiTestDeclensionComponent } from './component/fi/fi-test-declension.component';

@NgModule({
  declarations: [
    OppiComponent,
    FiSearchDeclensionComponent,
    FiTestDeclensionComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    RoutingModule,
    FormsModule,
    HttpClientModule,
    UiModule,
    I18nModule.forRoot('assets/i18n/', 'en', {'en': 'English', 'es': 'español', 'fi': 'suomi', 'pt': 'português', 'gl': 'galego'})
  ],
  providers: [
    WordInfoService,
    {provide: APP_INITIALIZER, useFactory: initWordInfoService, deps: [WordInfoService], multi: true},
    DataRouterService,
    FiDeclensionService
  ],
  bootstrap: [OppiComponent]
})
export class OppiModule { }
