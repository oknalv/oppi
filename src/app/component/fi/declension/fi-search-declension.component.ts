import { Component } from '@angular/core';
import { FiDeclensionService } from '../../../service/fi-declension.service';
import { FiDeclension, FiDeclensionForm, FiDeclensionString } from '../../../model/fi-inflection';
import { DataRouterService } from '../../../service/data-router.service';
import { ActivatedRoute } from '@angular/router';
import { FiNominalData } from '../../../model/word-data';
import { RouteListenerComponent } from '../../route-listener/route-listener';

@Component({
  selector: 'fi-search-declension',
  templateUrl: './fi-search-declension.component.html',
  styleUrls: [
    '../common.component.css',
  ]
})
export class FiSearchDeclensionComponent extends RouteListenerComponent<FiNominalData>{

  declensions: FiDeclension[];
  cases: string[];
  numbers: string[];
  word: string;

  constructor(
    private fiDeclensionService: FiDeclensionService,
    dataRouterService: DataRouterService,
    route: ActivatedRoute
  ) {
    super(dataRouterService, route);
  }

  init(data: FiNominalData){
    this.word = data.word;
    this.declensions = this.fiDeclensionService.inflect(data);
    this.numbers = Object.keys(this.declensions[0]);
    this.cases = Object.keys(this.declensions[0].singular);
  }

}
