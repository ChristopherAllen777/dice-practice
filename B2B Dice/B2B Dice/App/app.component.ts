import { Component } from '@angular/core';
import { CommonDataService } from './Common/CommonData.service';
import { PurchaseOrdersService } from './PurchaseOrders/PurchaseOrders.service';
import { TrackingInfoService } from './TrackingInfo/TrackingInfo.service';
import { MetricsService } from './Common/MetricsService.service';
import { ProfileService } from './Profile/Profile.service';
import { ExcelService } from './Common/Excel.service';
import { PagerService } from './Common/Pager.service';

@Component({
    selector: 'my-app',
    template: `<my-nav></my-nav><br />
                <router-outlet></router-outlet>`,
    providers: [PurchaseOrdersService, TrackingInfoService, CommonDataService, MetricsService, ProfileService,
        ExcelService, PagerService]
})
export class AppComponent {
    constructor() {
    }
}