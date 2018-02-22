import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { MetricsService } from '../Common/MetricsService.service';

@Component({
    selector: 'purchase-orders-browse',
    templateUrl: './PurchaseOrders.Browse.component.html'
})

export class PurchaseOrdersBrowseComponent implements OnInit {
    constructor(private _http: Http, private metrics: MetricsService, private router: Router) {
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Browse PO');
        this.metrics.sendMetric('Page loaded')
            .subscribe(() => {
                //needed to make call
            });
    }
}