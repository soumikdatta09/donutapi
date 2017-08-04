import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { ManufacturingUnits } from '../../models/manufacturingUnits';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';

@Injectable()
export class CampaignService {
    public token: string;
    public ManufacturingUnits: ManufacturingUnits;

    constructor(private http: Http) { }

    getCampaignList(): Observable<any> {
        if (window.sessionStorage.getItem('currentUser')) {
            this.token = JSON.parse(window.sessionStorage.getItem('currentUser')).token;
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': this.token
            });
            return this.http.get(environment.manufacturingUnitUrl, { headers })
                .map((res: Response) => res.json()
                ).catch((res: Response) => Observable.throw(res.status));
        }
    }
    public getJSON(): Observable<any> {
        return this.http.get('assets/locale-en.json')
            .map((res: any) => res.json());
    }
}
