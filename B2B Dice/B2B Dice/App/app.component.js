"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CommonData_service_1 = require("./Common/CommonData.service");
var PurchaseOrders_service_1 = require("./PurchaseOrders/PurchaseOrders.service");
var TrackingInfo_service_1 = require("./TrackingInfo/TrackingInfo.service");
var MetricsService_service_1 = require("./Common/MetricsService.service");
var Profile_service_1 = require("./Profile/Profile.service");
var Excel_service_1 = require("./Common/Excel.service");
var Pager_service_1 = require("./Common/Pager.service");
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "<my-nav></my-nav><br />\n                <router-outlet></router-outlet>",
        providers: [PurchaseOrders_service_1.PurchaseOrdersService, TrackingInfo_service_1.TrackingInfoService, CommonData_service_1.CommonDataService, MetricsService_service_1.MetricsService, Profile_service_1.ProfileService,
            Excel_service_1.ExcelService, Pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map