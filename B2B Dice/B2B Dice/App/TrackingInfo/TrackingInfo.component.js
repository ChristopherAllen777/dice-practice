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
var TrackingInfo_service_1 = require("../TrackingInfo/TrackingInfo.service");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var TrackingInfoComponent = (function () {
    function TrackingInfoComponent(trackingService, _http) {
        this.trackingService = trackingService;
        this._http = _http;
        this.trackingInfo = null;
        this._trackingNumber = null;
    }
    Object.defineProperty(TrackingInfoComponent.prototype, "trackingNumber", {
        get: function () { return this._trackingNumber; },
        set: function (trackingNumber) {
            this._trackingNumber = trackingNumber;
            this.getTrackingInfo();
        },
        enumerable: true,
        configurable: true
    });
    TrackingInfoComponent.prototype.getTrackingInfo = function () {
        var _this = this;
        if (this.trackingNumber) {
            this.trackingService.getTrackingInfo(this._trackingNumber)
                .subscribe(function (ti) {
                _this.trackingInfo = ti;
            });
        }
    };
    TrackingInfoComponent.prototype.isLatestTrackingStep = function (i) {
        if (i == 0) {
            return {
                'font-weight': 'bold'
            };
        }
    };
    return TrackingInfoComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], TrackingInfoComponent.prototype, "trackingNumber", null);
TrackingInfoComponent = __decorate([
    core_1.Component({
        selector: 'tracking-info',
        templateUrl: './TrackingInfo.component.html'
    }),
    __metadata("design:paramtypes", [TrackingInfo_service_1.TrackingInfoService, http_1.Http])
], TrackingInfoComponent);
exports.TrackingInfoComponent = TrackingInfoComponent;
//# sourceMappingURL=TrackingInfo.component.js.map