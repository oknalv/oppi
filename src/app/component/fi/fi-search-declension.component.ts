import { Component, OnInit } from '@angular/core';
import { FiDeclensionService } from '../../service/fi-declension.service';
import { Declension, DeclensionForm, DeclensionString } from '../../model/declension';
import { ModalComponent, ModalHeaderComponent, ModalBodyComponent } from '../../module/ui/ui';
import { DataRouterService } from '../../service/data-router.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FiDeclensionWordInfo } from '../../model/fi-declension-word-info';
import { RouteListenerComponent } from '../route-listener/route-listener';

@Component({
  selector: 'fi-search-declension',
  templateUrl: './fi-search-declension.component.html',
  styleUrls: [
    './fi-common-declension.component.css',
    './fi-search-declension.component.css'
  ]
})
export class FiSearchDeclensionComponent extends RouteListenerComponent<FiDeclensionWordInfo>{

  declensions: Declension[];
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

  init(data: FiDeclensionWordInfo){
    this.word = data.word;
    this.declensions = this.fiDeclensionService.decline(data);
    this.numbers = Object.keys(this.declensions[0]);
    this.cases = Object.keys(this.declensions[0].singular);
  }

}
