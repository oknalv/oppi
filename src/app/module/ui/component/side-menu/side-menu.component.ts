import { Component } from '@angular/core';
import { Hidder } from '../hidder/hidder';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent  extends Hidder {
  classForTheBody = 'side-menu-open';
}