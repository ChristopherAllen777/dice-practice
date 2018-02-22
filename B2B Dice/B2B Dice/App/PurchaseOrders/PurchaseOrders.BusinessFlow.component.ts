import { Component, Input, OnInit } from '@angular/core';
import { IPurchaseOrder } from './PurchaseOrder';
import { PurchaseOrdersService } from './PurchaseOrders.service';
import { ITrackingInfo } from '../TrackingInfo/TrackingInfo'
import { TrackingInfoService } from '../TrackingInfo/TrackingInfo.service';
import { CommonDataService } from '../Common/CommonData.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { MetricsService } from '../Common/MetricsService.service';
import { Subscription } from "rxjs/Subscription";

enum StepStatus {
    Completed = -1,
    NotStarted = 0,
    Failure = 1,
    InProgess = 2,
    Successful = 3,
    Warning = 4,
    Hold = 5
}

@Component({
    selector: 'business-flow',
    templateUrl: './PurchaseOrders.BusinessFlow.component.html'
})

export class BusinessFlowComponent implements OnInit {
    purchaseOrder: IPurchaseOrder = null;
    poReposted = false;
    additionalDetails: any = null;
    noAdditionalDetails = false;
    warnings: number[] = [];
    stepName: string = '';
    stepStyle = {
        'float': 'left',
        'width': <string>null,
        'height': 'auto',
        'overflow': 'auto'
    };

    private _po: IPurchaseOrder = null;
    @Input()
    set po(po: IPurchaseOrder) {
        this._po = po;
        this.stepStyle.width = (100.00 / this._po.lstOfSteps.length) + '%';
    }
    get po(): IPurchaseOrder { return this._po; }

    private _disableDetails: boolean = null;
    @Input()
    set disableDetails(disableDetails: boolean) {
        this._disableDetails = disableDetails;
    }
    get disableDetails(): boolean { return this._disableDetails; }

    constructor(private poSrvc: PurchaseOrdersService, private trackingService: TrackingInfoService,
        private commonDataService: CommonDataService, private _http: Http, private metrics: MetricsService) {
    }

    ngOnInit() {
        this.processSteps();
    }

    processSteps() {
        for (let i = this.po.lstOfSteps.length - 1; i >= 0; i--) {
            if (this.po.lstOfSteps[i].POStatus == StepStatus.Warning) {
                this.warnings.push(i);
                this.po.lstOfSteps[i].POStatus == StepStatus.Successful;
            }
            if ((i == this.po.lstOfSteps.length - 1 || this.po.lstOfSteps[i + 1].POStatus == StepStatus.NotStarted)
                && this.po.lstOfSteps[i].POStatus == StepStatus.Successful) {
                this.po.lstOfSteps[i].POStatus == StepStatus.Completed;
            }
        }
    }

    repostPO(id: number) {
        this.metrics.sendMetric('Reposting purchase order')
            .subscribe(() => {
                //needed to make call
            });
        this.additionalDetails = false;
        this.poReposted = true;

    }

    getAdditionalDetails(stepName: string) {
        this.metrics.sendMetric('Getting additional details for purchase order')
            .subscribe(() => {
                //needed to make call
            });
        let threadID = this.po.ThreadID;
        this.stepName = stepName;
        let poNum = this.po.PONumber;
        this.additionalDetails = null;
        this.noAdditionalDetails = false;
        this.poSrvc.getAdditionalDetails(stepName, threadID, poNum)
            .finally(() => {
                this.metrics.sendMetric('Getting additional details for purchase order finished')
                    .subscribe(() => {
                        //needed to make call
                    });
            })
            .subscribe((details) => {
                if (details.length != 0) {
                    this.additionalDetails = {};
                    this.additionalDetails[stepName] = details;
                }
                else {
                    this.noAdditionalDetails = true;
                }
            });
    }

    closeDetails() {
        this.additionalDetails = null;
    }

    //getStepTimestamp(stepID: number) {
    //    if (stepID > this.purchaseOrder.Status.ApplicationStep)
    //        return " ";

    //    var startTime = new Date(this.purchaseOrder.OrderDate).valueOf();
    //    var endTime = new Date(this.purchaseOrder.Status.LastUpdateTS).valueOf();
    //    var diff = endTime - startTime;
    //    var newTimeMS = ((diff / this.purchaseOrder.Status.ApplicationStep) * stepID)
    //    var newTime = new Date(startTime + newTimeMS)
    //    return newTime.toUTCString();
    //}

    getStepTooltip(stepStatus: number) {
        switch (stepStatus) {
            case StepStatus.Warning:
                return "Warning";
            case StepStatus.Successful:
                return "Successful";
            case StepStatus.Completed:
                return "Successful";
            case StepStatus.NotStarted:
                return "Not Started";
            case StepStatus.InProgess:
                return "In Progess";
            case StepStatus.Failure:
                return "Failure";
            case StepStatus.Hold:
                return "Hold";
        }
    }

    getWarningStatus(stepIndex: number) {
        return this.warnings.indexOf(stepIndex) != -1
    }

    setStatusColor(stepStatus: number) {
        return {
            complete: stepStatus == StepStatus.Completed,
            upcoming: stepStatus == StepStatus.NotStarted,
            successful: stepStatus == StepStatus.Successful,
            inProgress: stepStatus == StepStatus.InProgess,
            failed: stepStatus == StepStatus.Failure || stepStatus == StepStatus.Hold
        }
    }

    //isShipped(stepIndex: number) {
    //    var isShipped = stepIndex == this.steps.length - 1
    //        && this.purchaseOrder.Status.ApplicationStep == this.steps.length;
    //    this.shipped = isShipped;
    //    return isShipped;
    //}

    //getTTS() {
    //    var diffMs = new Date(this.purchaseOrder.Status.LastUpdateTS).valueOf() -
    //        new Date(this.purchaseOrder.OrderDate).valueOf();
    //    return diffMs / 86400000;
    //}

    //getTrackingInfo(stepIndex: number) {
    //    this.metrics.sendMetric('Getting tracking info for purchase order');
    //    if (this.isShipped(stepIndex)) {
    //        this.trackingNumber = this.purchaseOrder.Status.TrackingNumber;
    //    }
    //}

    //repositionButtonsIfShipped() {
    //    if (this.shipped) {
    //        return {
    //            'margin-top': '-50px'
    //        }
    //    }
    //    return {};
    //}
}