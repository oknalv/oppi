import { NgModule, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { I18nService } from './i18n.service';
import { I18nPipe } from './i18n.pipe';

export function init_service(i18nService: I18nService){
  return () => i18nService.init();
}

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [
    I18nPipe
  ],
  exports: [
    I18nPipe
  ]
})
export class I18nModule {

  static forRoot(path: string, defaultLanguageKey: string, languageKeys: object): ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [
        I18nService,
        {provide: 'path', useValue: path},
        {provide: 'defaultLanguageKey', useValue: defaultLanguageKey},
        {provide: 'languageKeys', useValue: languageKeys},
        {provide: APP_INITIALIZER, useFactory: init_service, deps: [I18nService], multi: true}
      ]
    }
  }

}
