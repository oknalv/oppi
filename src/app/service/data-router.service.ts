import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class DataRouterService {
    private map: object = {};

    constructor(private router: Router) {}

    navigate(route: string[], data?: any): void {
        if(data !== undefined){
            this.map[route.join('/')] = data;
        } else {
            delete this.map[route.join('/')];
        }
        this.router.navigate(route);
    }

    getData(key: string): any {
        let dataMap: object = this.map[decodeURIComponent(this.router.url).substr(1)];
        return dataMap ? dataMap[key] : null;
    }
}