import { Component, OnInit } from '@angular/core';
import { DataRouterService } from '../../service/data-router.service';
import { ActivatedRoute, Params } from '@angular/router';

//@Component({ })
export abstract class RouteListenerComponent<T> implements OnInit {

  constructor(
    private dataRouterService: DataRouterService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.load();
    });
  }

  private load(): void {
    let data: T = this.dataRouterService.getData();
    if(!data){
      this.dataRouterService.navigate(['/']);
    } else {
      this.init(data);
    }
  }

  protected abstract init(data: T);

}
