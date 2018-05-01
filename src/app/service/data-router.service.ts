import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class DataRouterService {
    private data: any = undefined;

    constructor(private router: Router) {}

    navigate(route: string[], data?: any): void {
        if(data !== undefined){
            this.data = data;
        }
        this.router.navigate(route, {replaceUrl: true});
    }

    getData(): any {
        let ret: any = this.data;
        this.data = undefined;
        return ret;
    }
}