import { Component, OnInit } from '@angular/core';
import { IPurchaseOrder } from './PurchaseOrder';
import { ITrackingInfo } from '../TrackingInfo/TrackingInfo'
import { PurchaseOrdersService } from './PurchaseOrders.service';
import { TrackingInfoService } from '../TrackingInfo/TrackingInfo.service';
import { CommonDataService } from '../Common/CommonData.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { MetricsService } from '../Common/MetricsService.service';
import { Subscription } from "rxjs/Subscription";
import { Router } from '@angular/router';

@Component({
    selector: 'purchase-orders-search',
    templateUrl: './PurchaseOrders.Track.component.html'
})

export class PurchaseOrdersTrackComponent implements OnInit {
    purchaseOrders: IPurchaseOrder[] = null;
    purchaseOrderNum: string = null;
    poReposted = false;
    additionalDetails = false;
    showResults = false;
    showNoResults = false;
    steps: string[] = null;
    trackingNumber: string = null;
    resultsLoading = false;
    shipped: boolean = false;

    navBarListener: Subscription = null;

    constructor(private poSrvc: PurchaseOrdersService, private trackingService: TrackingInfoService, private router: Router,
        private commonDataService: CommonDataService, private _http: Http, private metrics: MetricsService) {
        this.router.routerState.root.queryParams
            .subscribe(params => {
                if (params['poNum']) {
                    this.purchaseOrderNum = params['poNum'];
                    this.trackPurchaseOrder(this.purchaseOrderNum);
                }
            });
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Track PO');
        this.metrics.sendMetric('Page loaded')
            .subscribe(() => {
                //needed to make call
            });

        this.commonDataService.setPageTitle('Track PO');
        this.commonDataService.pageChange();

        //this.navBarListener = this.commonDataService.onPoSearch.subscribe(() => {
        //    let selectedPo = this.commonDataService.getSelectedPO();
        //    if (selectedPo) {
        //        this.purchaseOrderNum = selectedPo;
        //        this.trackPurchaseOrder(this.purchaseOrderNum);
        //    }
        //})
    }

    //ngOnDestroy() {
    //    this.navBarListener.unsubscribe();
    //}

    clearPO() {
        this.purchaseOrderNum = '';
    }

    trackPurchaseOrder(id: string) {
        if (id != '') {
            this.metrics.sendMetric('Track purchase order started')
                .subscribe(() => {
                    //needed to make call
                });

            this.poReposted = false;
            this.additionalDetails = false;
            this.trackingNumber = null;
            this.resultsLoading = true;
            this.poSrvc.getPurchaseOrderById(id)
                .finally(() => {
                    this.metrics.sendMetric('Track purchase order finished')
                        .subscribe(() => {
                            //needed to make call
                        });
                })
                .subscribe((POs) => {
                    if (this.validatePOs(POs.lst)) {
                        this.purchaseOrders = POs.lst;
                        this.showResults = true;
                        this.showNoResults = false;
                    }
                    else {
                        this.purchaseOrders = null;
                        this.showNoResults = true;
                        this.showResults = false;
                    }
                    this.resultsLoading = false;
                });
        }
        else {
            this.showNoResults = true;
            this.showResults = false;
        }
    }

    validatePOs(POs: IPurchaseOrder[]) {
        var valid = true;
        if (POs.length == 0) {
            valid = false;
        }
        return valid;
    }
}
