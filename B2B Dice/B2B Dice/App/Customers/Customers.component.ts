import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { MetricsService } from '../Common/MetricsService.service';

@Component({
    selector: 'customers',
    templateUrl: './Customers.component.html'
})

export class CustomersComponent implements OnInit {
    constructor(private _http: Http, private metrics: MetricsService, private router: Router) {
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Customer Search');
        this.metrics.sendMetric('Page loaded')
            .subscribe(() => {
                //needed to make call
            });
    }
}