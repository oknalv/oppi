import { Component } from '@angular/core';
import { FiDeclensionService } from '../../../service/fi-declension.service';
import { FiDeclension, FiDeclensionForm, FiDeclensionString, FiDeclensionErrors } from '../../../model/fi-inflection';
import { DataRouterService } from '../../../service/data-router.service';
import { ActivatedRoute } from '@angular/router';
import { FiNominalData } from '../../../model/word-data';
import { FiSearchDeclensionComponent } from './fi-search-declension.component';
import { UtilsService } from '../../../service/utils.service';

@Component({
  selector: 'fi-test-declension',
  templateUrl: './fi-test-declension.component.html',
  styleUrls: [
    '../common.component.css',
    './fi-test-declension.component.css'
  ]
})
export class FiTestDeclensionComponent extends FiSearchDeclensionComponent {

  private declensionErrors: FiDeclensionErrors;
  private declensionToCheck: FiDeclensionString = new FiDeclensionString();

  constructor(
    fiDeclensionService: FiDeclensionService,
    dataRouterService: DataRouterService,
    route: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    super(fiDeclensionService, dataRouterService, route)
  }

  init(data: FiNominalData): void {
    super.init(data);
    this.reset();
  }

  check(): void {
    this.declensionErrors = null;
    for(let declension of this.declensions){
      if(!this.declensionErrors || this.declensionErrors.numberOfErrors > 0){
          let declensionToCheckAux: FiDeclension = this.declensionStringToDeclension(this.declensionToCheck);
          let declensionErrorsAux: FiDeclensionErrors = this.compareDeclensions(declension, declensionToCheckAux);
          if(!this.declensionErrors || this.declensionErrors.numberOfErrors > declensionErrorsAux.numberOfErrors){
            this.declensionErrors = declensionErrorsAux;
          }
      }
    }
  }

  reset(): void {
    this.declensionErrors = null;
    this.declensionToCheck = new FiDeclensionString();
  }

  private declensionStringToDeclension(declensionString: FiDeclensionString): FiDeclension {
    let declension: FiDeclension = new FiDeclension();
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

  private compareDeclensions(correctDeclension: FiDeclension, declensionToCheck: FiDeclension): FiDeclensionErrors {
    let declensionErrors: FiDeclensionErrors = new FiDeclensionErrors();
    for(let numberName in correctDeclension){
      let numberForm: FiDeclensionForm = correctDeclension[numberName];
      for(let caseName in numberForm){
        let checkCaseForms: string[] = declensionToCheck[numberName][caseName];
        if(checkCaseForms != null && checkCaseForms.length > 0){
          let caseForms: string[] = numberForm[caseName];
          if(!this.utilsService.isContained(caseForms, checkCaseForms)){
            declensionErrors.numberOfErrors++;
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
