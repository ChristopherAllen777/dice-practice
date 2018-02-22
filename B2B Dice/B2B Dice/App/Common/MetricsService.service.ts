import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONSTANTS } from '../Common/CONSTANTS';
import 'rxjs/add/operator/map';
import { IMetric } from './Metric'

@Injectable()
export class MetricsService {
    constructor(private _http: Http) { }

    sendMetric(event: string) {
        var metric: IMetric = {
            SessionID: sessionStorage.getItem('sessionID'),
            SessionUser: sessionStorage.getItem('sessionUser'),
            Page: sessionStorage.getItem('currentPage'),
            Description: event,
            Timestamp: new Date()
        };

        return this._http.post(CONSTANTS._diceApiUrl() + '/UserMetrics', metric)
            .map((response: Response) => response.json());
    }
}