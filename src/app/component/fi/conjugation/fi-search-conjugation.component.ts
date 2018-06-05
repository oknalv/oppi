import { Component } from '@angular/core';
import { FiConjugation } from '../../../model/fi-inflection';
import { DataRouterService } from '../../../service/data-router.service';
import { ActivatedRoute } from '@angular/router';
import { FiVerbData } from '../../../model/word-data';
import { RouteListenerComponent } from '../../route-listener/route-listener';
import { FiConjugationService } from '../../../service/fi-conjugation.service';

@Component({
  selector: 'fi-search-conjugation',
  templateUrl: './fi-search-conjugation.component.html',
  styleUrls: [
    '../common.component.css',
    './fi-common-conjugation.component.css'
  ]
})
export class FiSearchConjugationComponent extends RouteListenerComponent<FiVerbData>{

  conjugations: FiConjugation[];
  word: string;
  showTables: FiConjugationShowTables[] = [];

  constructor(
    private fiConjugationService: FiConjugationService,
    dataRouterService: DataRouterService,
    route: ActivatedRoute
  ) {
    super(dataRouterService, route);
  }

  init(data: FiVerbData): void {
    this.word = data.word;
    this.conjugations = this.fiConjugationService.inflect(data);
    this.resetShowTables();
  }

  protected resetShowTables(): void {
    this.showTables = [];
    for(let i = 0; i < this.conjugations.length; i++){
      this.showTables.push(new FiConjugationShowTables());
    }
  }

}

export class FiConjugationShowTables {
  personalForms: boolean = true;
  indicative: boolean = true;
  indicativePresent: boolean = true;
  indicativePerfect: boolean = true;
  indicativeImperfect: boolean = true;
  indicativePluperfect: boolean = true;
  conditional: boolean = true;
  conditionalPresent: boolean = true;
  conditionalPerfect: boolean = true;
  imperative: boolean = true;
  imperativePresent: boolean = true;
  imperativePerfect: boolean = true;
  potential: boolean = true;
  potentialPresent: boolean = true;
  potentialPerfect: boolean = true;
  nominalForms: boolean = true;
  infinitives: boolean = true;
  participles: boolean = true;
}
