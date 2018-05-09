import { Component } from '@angular/core';
import { Hider } from '../hider/hider';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent  extends Hider {
  classForTheBody = 'side-menu-open';
}