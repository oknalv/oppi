import { Component, OnInit } from '@angular/core';
import { FiDeclensionService } from '../../service/fi-declension.service';
import { Declension, DeclensionForm, DeclensionString } from '../../model/declension';
import { ModalComponent, ModalHeaderComponent, ModalBodyComponent } from '../../module/ui/ui';
import { DataRouterService } from '../../service/data-router.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FiDeclensionWordInfo } from '../../model/fi-declension-word-info';
import { FiSearchDeclensionComponent } from './fi-search-declension.component';
import { FiDeclensionErrors } from '../../model/fi-declension-errors';

@Component({
  selector: 'fi-test-declension',
  templateUrl: './fi-test-declension.component.html',
  styleUrls: [
    './fi-common-declension.component.css',
    './fi-test-declension.component.css'
  ]
})
export class FiTestDeclensionComponent extends FiSearchDeclensionComponent {

  private declensionErrors: object;
  private declensionToCheck: DeclensionString = new DeclensionString();

  constructor(
    fiDeclensionService: FiDeclensionService,
    dataRouterService: DataRouterService,
    route: ActivatedRoute
  ) {
    super(fiDeclensionService, dataRouterService, route)
  }

  init(data: FiDeclensionWordInfo){
    super.init(data);
    this.reset();
  }

  check(): void{
    this.declensionErrors = null;
    for(let declension of this.declensions){
      if(!this.declensionErrors || this.declensionErrors['numberOfErrors'] > 0){
          let declensionToCheckAux = this.declensionStringToDeclension(this.declensionToCheck);
          let declensionErrorsAux = this.compareDeclensions(declension, declensionToCheckAux);
          if(!this.declensionErrors || this.declensionErrors['numberOfErrors'] > declensionErrorsAux['numberOfErrors']){
            this.declensionErrors = declensionErrorsAux;
          }
      }
    }
  }

  reset(): void {
    this.declensionErrors = null;
    this.declensionToCheck = new DeclensionString();
  }

  private declensionStringToDeclension(declensionString: DeclensionString): Declension {
    let declension: Declension = new Declension();
    for(let numberName in declensionString){
      for(let caseName in declensionString[numberName]){
        declension[numberName][caseName] =
          declensionString[numberName][caseName] != null && declensionString[numberName][caseName] != '' ?
          declensionString[numberName][caseName].split(',').map((caseForm: string) => caseForm.trim()).sort() :
          declension[numberName][caseName];
      };
    };
    return declension;
  }

  private compareDeclensions(correctDeclension: Declension, declensionToCheck: Declension): object {
    let declensionErrors: FiDeclensionErrors = new FiDeclensionErrors;
    for(let numberName in correctDeclension){
      let numberForm: DeclensionForm = correctDeclension[numberName];
      for(let caseName in numberForm){
        let checkCaseForms: string[] = declensionToCheck[numberName][caseName];
        if(checkCaseForms != null && checkCaseForms.length > 0){
          let caseForms: string[] = numberForm[caseName];
          let isContained: boolean =
            !(caseForms.length > 0 && checkCaseForms.length == 0) &&
            !(caseForms.length == 0 && checkCaseForms.length > 0) &&
            caseForms.filter(function(caseForm){
              return checkCaseForms.includes(caseForm);
            }.bind(this)).length == checkCaseForms.length;
          if(!isContained){
            declensionErrors['numberOfErrors']++;
            declensionErrors[numberName][caseName] = true;
          }
          else {
            declensionErrors[numberName][caseName] = false;
          }
        }
      };
    };
    return declensionErrors;
  }

}
