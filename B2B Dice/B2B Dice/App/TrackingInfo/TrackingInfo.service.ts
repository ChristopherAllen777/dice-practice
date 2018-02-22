import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ITrackingInfo } from './TrackingInfo';

@Injectable()
export class TrackingInfoService {
    //private _trackingInfoUrl = 'app/trackingInfo.json';
    private _trackingInfoUrl = 'http://p1vmb2bls01.olqa.preol.dell.com:4000/api/TrackingInfo';
    constructor(private _http: Http) { }

    getTrackingInfo(id: string) {
        return this._http.get(this._trackingInfoUrl)
            .map((response: Response) => response.json());
    }
}