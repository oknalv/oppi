import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

import { OppiComponent } from './oppi.component';
import { RoutingModule } from './routing.module';
import { DeclesionService } from './service/declesion.service';
import { WordInfoService } from './service/word-info.service';
import { DeclineComponent } from './component/decline/decline.component';
import { LoadingComponent } from './component/loading/loading.component';
import { I18nModule } from './module/i18n/i18n';
import { UiModule } from './module/ui/ui';


@NgModule({
  declarations: [
    OppiComponent,
    DeclineComponent,
    LoadingComponent
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
  providers: [DeclesionService, WordInfoService],
  bootstrap: [OppiComponent]
})
export class OppiModule { }
