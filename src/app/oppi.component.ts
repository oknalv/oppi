import { Component, OnInit } from '@angular/core';
import { I18nService } from './module/i18n/i18n';

@Component({
  selector: 'oppi',
  templateUrl: './oppi.component.html',
  styleUrls: ['./oppi.component.css']
})
export class OppiComponent implements OnInit {
  currentLanguageKey: string;
  languageKeys: string[];
  private languages: object;

  constructor(private i18nService: I18nService){ }

  ngOnInit(): void {
    this.languages = this.i18nService.getLanguageKeys();
    this.languageKeys = Object.keys(this.languages);
    this.currentLanguageKey = this.i18nService.getCurrentLanguageKey();
  }

  changeLanguage(): void {
    this.i18nService.changeLanguage(this.currentLanguageKey);
  }

}
