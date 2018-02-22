import { PurchaseOrdersService } from '../app/PurchaseOrders/PurchaseOrders.service';
import { PurchaseOrdersTrackComponent } from '../app/PurchaseOrders/PurchaseOrders.Track.component';
import { CommonDataService } from '../app/Common/CommonData.service';
import { IPurchaseOrder } from '../app/PurchaseOrders/PurchaseOrder';
import { destroyPlatform } from '@angular/core';
import {
    async,
    inject,
    TestBed,
    ComponentFixture
} from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

class MockPurchaseOrdersService extends PurchaseOrdersService {
    private purchaseOrder = {
        "PONumber": "2",
        "ThreadID": 750,
        "lstOfSteps": [
            {
                "Name": "test",
                "POStatus": 2
            },
            {
                "Name": "test",
                "POStatus": 2
            }
        ]
    };

    getPurchaseOrderById(id: string): Observable<IPurchaseOrder> {
        return Observable.of(this.purchaseOrder).map((value) => <IPurchaseOrder>value);
    }
}

describe('Testing Purchase Order Component', () => {

    let fixture: ComponentFixture<PurchaseOrdersTrackComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PurchaseOrdersTrackComponent],
            providers: [PurchaseOrdersService, CommonDataService],
            imports: [BrowserModule, FormsModule, HttpModule],
        });

        TestBed.overrideComponent(PurchaseOrdersTrackComponent, {
            set: {
                providers: [{ provide: PurchaseOrdersService, useClass: MockPurchaseOrdersService }],
                templateUrl: null,
                template: '<div *ngIf="purchaseOrder">' +
                '<div id="PurchaseOrderNo">{{purchaseOrder.PurchaseOrderNo}}</div>' +
                '<div id="OrderAmount">{{purchaseOrder.OrderAmount | currency}}</div>' +
                '<div id="OrderDate">{{purchaseOrder.OrderDate}}</div>' +
                '<div id="CustomerNo">{{purchaseOrder.CustomerNo}}</div>' +
                '<div id="ApplicationStep">{{purchaseOrder.Status.ApplicationStep}}</div>' +
                '<div id="ApplicationStatusid">{{purchaseOrder.Status.ApplicationStatus}}</div>' +
                '<div id="FailureText" *ngIf="purchaseOrder.Status.FailureText">{{purchaseOrder.Status.FailureText}}</div>' +
                '<div id="LastUpdateTS">{{purchaseOrder.Status.LastUpdateTS}}</div>' +
                '</div>'
            }
        })

        fixture = TestBed.createComponent(PurchaseOrdersTrackComponent)
        fixture.detectChanges();
    });

    it('Should get purchase order from service', inject([PurchaseOrdersService, CommonDataService], (injectService: [PurchaseOrdersService, CommonDataService]) => {
        fixture.componentInstance.trackPurchaseOrder('1');
        fixture.whenStable()
            .then(() => {
                fixture.detectChanges();
                return fixture.whenStable();
            })
            .then(() => {
                const compiled = fixture.debugElement.nativeElement;
                expect(compiled.querySelector('PurchaseOrderNo').innerText).toEqual('2');
                expect(compiled.querySelector('OrderAmount').innerText).toEqual('750');
                expect(compiled.querySelector('OrderDate').innerText).toEqual('08/2/2017');
                expect(compiled.querySelector('CustomerNo').innerText).toEqual('1');
                expect(compiled.querySelector('ApplicationStep').innerText).toEqual('2');
                expect(compiled.querySelector('ApplicationStatus').innerText).toEqual('Failure');
                expect(compiled.querySelector('FailureText').innerText).toEqual('Connection timeout');
                expect(compiled.querySelector('LastUpdateTS').innerText).toEqual('08/2/2017 10:11:04 AM');
            });
    }));
});