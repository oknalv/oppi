import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18nPipe } from './i18n.pipe';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class I18nService {
  private languages: object;
  private currentLanguageKey: string;

  constructor(
    private http: HttpClient,
    @Inject('path') private path: string,
    @Inject('defaultLanguageKey') private defaultLanguageKey: string,
    @Inject('languageKeys') private languageKeys: object
  ) { }

  init(): Promise<any> {
    this.currentLanguageKey = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.defaultLanguageKey;
    localStorage.setItem('lang', this.currentLanguageKey);
    this.languages = {};
    return this.http.get(this.path + this.defaultLanguageKey + '.json').map(function(data){
      this.languages[this.defaultLanguageKey] = data;
    }.bind(this)).toPromise().then(function(){
      if(this.currentLanguageKey != this.defaultLanguageKey){
        return this.http.get(this.path + this.currentLanguageKey + '.json').map(function(data){
          this.languages[this.currentLanguageKey] = data;
        }.bind(this)).toPromise();
      }
      else {
        return new Promise<any>((resolve, reject) => resolve());
      }
    }.bind(this));
  }

  getTranslation(key: string, placeholders: string[]): string {
    let translation = this.languages[this.currentLanguageKey][key];
    translation = translation ? translation : this.languages[this.defaultLanguageKey][key];
    return eval('`' + translation + '`');
  }

  changeLanguage(languageKey: string): void {
    if(languageKey != this.currentLanguageKey){
      if(Object.keys(this.languages).indexOf(languageKey) == -1){
        this.http.get(this.path + languageKey + '.json').subscribe(function(data){
          this.currentLanguageKey = languageKey;
          this.languages[languageKey] = data;
        }.bind(this), function(){
          this.currentLanguageKey = this.defaultLanguageKey;
        }.bind(this),
        function(){
          localStorage.setItem('lang', this.currentLanguageKey);
        }.bind(this));
      }
      else{
        this.currentLanguageKey = languageKey;
        localStorage.setItem('lang', this.currentLanguageKey);
      }
    }
  }

  getLanguageKeys(): object {
    return this.languageKeys;
  }

  getCurrentLanguageKey(): string {
    return this.currentLanguageKey;
  }

}
