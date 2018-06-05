import { Component } from '@angular/core';
import { FiConjugation, FiConjugationString, FiConjugationErrors, FiTense, FiTenseString, FiTenseErrors, FiInfinitives, FiInfinitivesString, FiParticiples, FiParticiplesString } from '../../../model/fi-inflection';
import { DataRouterService } from '../../../service/data-router.service';
import { ActivatedRoute } from '@angular/router';
import { FiVerbData } from '../../../model/word-data';
import { RouteListenerComponent } from '../../route-listener/route-listener';
import { FiConjugationService } from '../../../service/fi-conjugation.service';
import { FiSearchConjugationComponent, FiConjugationShowTables } from './fi-search-conjugation.component';
import { UtilsService } from '../../../service/utils.service';

@Component({
  selector: 'fi-test-conjugation',
  templateUrl: './fi-test-conjugation.component.html',
  styleUrls: [
    '../common.component.css',
    './fi-common-conjugation.component.css'
  ]
})
export class FiTestConjugationComponent extends FiSearchConjugationComponent{

  showTable: FiConjugationShowTables = new FiConjugationShowTables();
  conjugationToCheck: FiConjugationString = new FiConjugationString();
  conjugationErrors: FiConjugationErrors;

  constructor(
    fiConjugationService: FiConjugationService,
    dataRouterService: DataRouterService,
    route: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    super(fiConjugationService, dataRouterService, route);
  }

  init(data: FiVerbData){
    super.init(data);
    this.reset();
  }

  resetShowTables(): void {
    this.showTable = new FiConjugationShowTables();
  }

  check(): void {
    this.conjugationErrors = null;
    for(let conjugation of this.conjugations){
      if(!this.conjugationErrors || this.conjugationErrors.numberOfErrors > 0){
          let conjugationErrorsAux: FiConjugationErrors = this.compareConjugations(conjugation, this.conjugationToCheck);
          if(!this.conjugationErrors || this.conjugationErrors.numberOfErrors > conjugationErrorsAux.numberOfErrors){
            this.conjugationErrors = conjugationErrorsAux;
          }
      }
    }
  }

  private compareConjugations(conjugation: FiConjugation, conjugationToCheck: FiConjugationString): FiConjugationErrors {
    let conjugationErrors: FiConjugationErrors = new FiConjugationErrors;
    //indicative present and perfect
    this.compareCommonPresent(conjugation.moods.indicative.present, conjugationToCheck.moods.indicative.present, 'indicative', conjugationErrors);
    this.compareCommonPerfect(conjugation.moods.indicative.past, conjugationToCheck.moods.indicative.perfect, 'indicative', 'perfect', conjugationErrors);
    
    //indicative past and pluperfect
    this.compareIndicativePast(conjugation.moods.indicative.past, conjugationToCheck.moods.indicative.past, conjugationErrors);
    this.compareCommonPerfect(conjugation.moods.indicative.past, conjugationToCheck.moods.indicative.pluperfect, 'indicative', 'pluperfect', conjugationErrors);
    
    //conditionals
    this.compareCommonPresent(conjugation.moods.conditional.present, conjugationToCheck.moods.conditional.present, 'conditional', conjugationErrors);
    this.compareCommonPerfect(conjugation.moods.indicative.past, conjugationToCheck.moods.conditional.perfect, 'conditional', 'perfect', conjugationErrors);

    //imperatives
    this.compareImperativePresent(conjugation.moods.imperative.present, conjugationToCheck.moods.imperative.present, conjugationErrors);
    this.compareImperativePerfect(conjugation.moods.indicative.past, conjugationToCheck.moods.imperative.perfect, conjugationErrors);
    
    //potentials
    this.compareCommonPresent(conjugation.moods.potential.present, conjugationToCheck.moods.potential.present, 'potential', conjugationErrors);
    this.compareCommonPerfect(conjugation.moods.indicative.past, conjugationToCheck.moods.potential.perfect, 'potential', 'perfect', conjugationErrors);

    //nominal forms
    this.compareNominalForm(conjugation.nominalForms.infinitives, conjugationToCheck.nominalForms.infinitives, 'infinitives', conjugationErrors);
    this.compareNominalForm(conjugation.nominalForms.participles, conjugationToCheck.nominalForms.participles, 'participles', conjugationErrors);

    return conjugationErrors;
  }

  private compareCommonPresent(fiPresent: FiTense, fiPresentToCheck: FiTenseString, mood: string, conjugationErrors: FiConjugationErrors): void {
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPresentToCheck['singular' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPresent['singular' + i], form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods[mood].present['singular' + i] = true;
        } else {
          conjugationErrors.moods[mood].present['singular' + i] = false;          
        }
      }
    }
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPresentToCheck['plural' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPresent['plural' + i], form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods[mood].present['plural' + i] = true;
        } else {
          conjugationErrors.moods[mood].present['plural' + i] = false;          
        }
      }
    }
    let passive: string[] = this.splitString(fiPresentToCheck.passive);
    if(passive.length > 0){
      if(!this.utilsService.isContained(fiPresent.passive, passive)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods[mood].present.passive = true;
      } else {
        conjugationErrors.moods[mood].present.passive = false;        
      }
    }
    for(let i = 1; i < 7; i++){
      let form: string[] = this.splitString(fiPresentToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPresent.negative1, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods[mood].present['negative' + i] = true;
        } else {
          conjugationErrors.moods[mood].present['negative' + i] = false;          
        }
      }
    }
    let passiveNegative: string[] = this.splitString(fiPresentToCheck.passiveNegative);
    if(passiveNegative.length > 0){
      if(!this.utilsService.isContained(fiPresent.passiveNegative, passiveNegative)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods[mood].present.passiveNegative = true;
      } else {
        conjugationErrors.moods[mood].present.passiveNegative = false;        
      }
    }
  }

  private compareIndicativePast(fiPast: FiTense, fiPastToCheck: FiTenseString, conjugationErrors: FiConjugationErrors): void {
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPastToCheck['singular' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast['singular' + i], form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.indicative.past['singular' + i] = true;
        } else {
          conjugationErrors.moods.indicative.past['singular' + i] = false;
        }
      }
    }
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPastToCheck['plural' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast['plural' + i], form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.indicative.past['plural' + i] = true;
        } else {
          conjugationErrors.moods.indicative.past['plural' + i] = false;
        }
      }
    }
    let passive: string[] = this.splitString(fiPastToCheck.passive);
    if(passive.length > 0){
      if(!this.utilsService.isContained(fiPast.passive, passive)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods.indicative.past.passive = true;
      } else {
        conjugationErrors.moods.indicative.past.passive = false;
      }
    }
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPastToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative1, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.indicative.past['negative' + i] = true;
        } else {
          conjugationErrors.moods.indicative.past['negative' + i] = false;          
        }
      }
    }
    for(let i = 4; i < 7; i++){
      let form: string[] = this.splitString(fiPastToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative2, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.indicative.past['negative' + i] = true;
        } else {
          conjugationErrors.moods.indicative.past['negative' + i] = false;
        }
      }
    }
    let passiveNegative: string[] = this.splitString(fiPastToCheck.passiveNegative);
    if(passiveNegative.length > 0){
      if(!this.utilsService.isContained(fiPast.passiveNegative, passiveNegative)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods.indicative.past.passiveNegative = true;
      } else {
        conjugationErrors.moods.indicative.past.passiveNegative = false;        
      }
    }
  }

  private compareImperativePresent(fiPresent: FiTense, fiPresentToCheck: FiTenseString, conjugationErrors: FiConjugationErrors): void {
    for(let i = 2; i < 4; i++){
      let form: string[] = this.splitString(fiPresentToCheck['singular' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPresent['singular' + i], form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.imperative.present['singular' + i] = true;
        } else {
          conjugationErrors.moods.imperative.present['singular' + i] = false;          
        }
      }
    }
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPresentToCheck['plural' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPresent['plural' + i], form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.imperative.present['plural' + i] = true;
        } else {
          conjugationErrors.moods.imperative.present['plural' + i] = false;          
        }
      }
    }
    let passive: string[] = this.splitString(fiPresentToCheck.passive);
    if(passive.length > 0){
      if(!this.utilsService.isContained(fiPresent.passive, passive)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods.imperative.present.passive = true;
      } else {
        conjugationErrors.moods.imperative.present.passive = false;        
      }
    }
    let negative2: string[] = this.splitString(fiPresentToCheck.negative2);
    if(negative2.length > 0){
      if(!this.utilsService.isContained(fiPresent.singular2, negative2)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods.imperative.present.negative2 = true;
      } else {
        conjugationErrors.moods.imperative.present.negative2 = false;        
      }
    }
    for(let i = 3; i < 7; i++){
      let form: string[] = this.splitString(fiPresentToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPresent.negative1, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.imperative.present['negative' + i] = true;
        } else {
          conjugationErrors.moods.imperative.present['negative' + i] = false;
        }
      }
    }
    let passiveNegative: string[] = this.splitString(fiPresentToCheck.passiveNegative);
    if(passiveNegative.length > 0){
      if(!this.utilsService.isContained(fiPresent.passiveNegative, passiveNegative)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods.imperative.present.passiveNegative = true;
      } else {
        conjugationErrors.moods.imperative.present.passiveNegative = false;        
      }
    }
  }

  private compareImperativePerfect(fiPast: FiTense, fiPerfectToCheck: FiTenseString, conjugationErrors: FiConjugationErrors): void {
    for(let i = 2; i < 4; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['singular' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative1, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.imperative.perfect['singular' + i] = true;
        } else {
          conjugationErrors.moods.imperative.perfect['singular' + i] = false;          
        }
      }
    }
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['plural' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative2, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.imperative.perfect['plural' + i] = true;
        } else {
          conjugationErrors.moods.imperative.perfect['plural' + i] = false;          
        }
      }
    }
    let passive: string[] = this.splitString(fiPerfectToCheck.passive);
    if(passive.length > 0){
      if(!this.utilsService.isContained(fiPast.passiveNegative, passive)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods.imperative.perfect.passive = true;
      } else {
        conjugationErrors.moods.imperative.perfect.passive = false;        
      }
    }
    for(let i = 2; i < 4; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative1, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.imperative.perfect['negative' + i] = true;
        } else {
          conjugationErrors.moods.imperative.perfect['negative' + i] = false;
        }
      }
    }
    for(let i = 4; i < 7; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative2, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods.imperative.perfect['negative' + i] = true;
        } else {
          conjugationErrors.moods.imperative.perfect['negative' + i] = false;
        }
      }
    }
    let passiveNegative: string[] = this.splitString(fiPerfectToCheck.passiveNegative);
    if(passiveNegative.length > 0){
      if(!this.utilsService.isContained(fiPast.passiveNegative, passiveNegative)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods.imperative.perfect.passiveNegative = true;
      } else {
        conjugationErrors.moods.imperative.perfect.passiveNegative = false;        
      }
    }
  }

  private compareCommonPerfect(fiPast: FiTense, fiPerfectToCheck: FiTenseString, mood: string, tense: string, conjugationErrors: FiConjugationErrors): void {
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['singular' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative1, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods[mood][tense]['singular' + i] = true;
        } else {
          conjugationErrors.moods[mood][tense]['singular' + i] = false;          
        }
      }
    }
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['plural' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative2, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods[mood][tense]['plural' + i] = true;
        } else {
          conjugationErrors.moods[mood][tense]['plural' + i] = false;          
        }
      }
    }
    let passive: string[] = this.splitString(fiPerfectToCheck.passive);
    if(passive.length > 0){
      if(!this.utilsService.isContained(fiPast.passiveNegative, passive)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods[mood][tense].passive = true;
      } else {
        conjugationErrors.moods[mood][tense].passive = false;        
      }
    }
    for(let i = 1; i < 4; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative1, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods[mood][tense]['negative' + i] = true;
        } else {
          conjugationErrors.moods[mood][tense]['negative' + i] = false;
        }
      }
    }
    for(let i = 4; i < 7; i++){
      let form: string[] = this.splitString(fiPerfectToCheck['negative' + i]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiPast.negative2, form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.moods[mood][tense]['negative' + i] = true;
        } else {
        conjugationErrors.moods[mood][tense]['negative' + i] = false;          
        }
      }
    }
    let passiveNegative: string[] = this.splitString(fiPerfectToCheck.passiveNegative);
    if(passiveNegative.length > 0){
      if(!this.utilsService.isContained(fiPast.passiveNegative, passiveNegative)){
        conjugationErrors.numberOfErrors++;
        conjugationErrors.moods[mood][tense].passiveNegative = true;
      } else {
        conjugationErrors.moods[mood][tense].passiveNegative = false;
      }
    }
  }

  private compareNominalForm(fiForm: FiInfinitives | FiParticiples, fiFormToCheck: FiInfinitivesString| FiParticiplesString, nominalFormName: string, conjugationErrors: FiConjugationErrors){
    for(let formName in fiForm){
      let form: string[] = this.splitString(fiFormToCheck[formName]);
      if(form.length > 0){
        if(!this.utilsService.isContained(fiForm[formName], form)){
          conjugationErrors.numberOfErrors++;
          conjugationErrors.nominalForms[nominalFormName][formName] = true;
        } else {
          conjugationErrors.nominalForms[nominalFormName][formName] = false;
        }
      }
    }
  }

  private splitString(str: string): string[] {
    return str != null && str != '' ? str.split(',').map((s) => s.trim()).sort() : [];
  }
  

  reset(): void {
    this.conjugationErrors = null;
    this.conjugationToCheck = new FiConjugationString();
  }

}
