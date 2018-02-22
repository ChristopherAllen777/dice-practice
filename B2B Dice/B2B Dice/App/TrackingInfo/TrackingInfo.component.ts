import { Component, Input } from '@angular/core';
import { ITrackingInfo } from '../TrackingInfo/TrackingInfo'
import { TrackingInfoService } from '../TrackingInfo/TrackingInfo.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
    selector: 'tracking-info',
    templateUrl: './TrackingInfo.component.html'
})

export class TrackingInfoComponent {
    trackingInfo: ITrackingInfo = null;
    private _trackingNumber: string = null;

    @Input()
    set trackingNumber(trackingNumber: string) {
        this._trackingNumber = trackingNumber;
        this.getTrackingInfo();
    }

    get trackingNumber(): string { return this._trackingNumber; }

    constructor(private trackingService: TrackingInfoService, private _http: Http) {
    }

    getTrackingInfo() {
        if (this.trackingNumber) {
            this.trackingService.getTrackingInfo(this._trackingNumber)
                .subscribe((ti) => {
                    this.trackingInfo = ti;
                });
        }
    }

    isLatestTrackingStep(i: number) {
        if (i == 0) {
            return {
                'font-weight': 'bold'
            }
        }
    }
}