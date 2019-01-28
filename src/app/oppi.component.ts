import { Component, OnInit } from '@angular/core';

import { DataRouterService } from './service/data-router.service';

@Component({
  selector: 'oppi',
  templateUrl: './oppi.component.html',
  styleUrls: ['./oppi.component.css']
})
export class OppiComponent implements OnInit{

  constructor(private dataRouterService: DataRouterService){}

  ngOnInit(): void {
    if(!localStorage.getItem('tutorial')){
      localStorage.setItem('tutorial', 'done');
      this.dataRouterService.navigate(['tutorial']);
    }
  }
}
