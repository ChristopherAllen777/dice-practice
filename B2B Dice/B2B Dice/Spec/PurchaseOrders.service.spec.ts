import {
    fakeAsync,
    inject,
    tick,
    TestBed
} from '@angular/core/testing';
import {
    HttpModule,
    Http,
    ResponseOptions,
    Response
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { PurchaseOrdersService } from '../app/PurchaseOrders/PurchaseOrders.service';

const mockResponse = {
    "PurchaseOrderNo": 1,
    "OrderAmount": 2584,
    "OrderDate": "08/1/2017",
    "CustomerNo": 1,
    "Status": {
        "ApplicationStep": 3,
        "ApplicationStatus": "Success",
        "FailureText": "",
        "LastUpdateTS": "08/2/2017 10:11:04 AM"
    }
};

describe('Testing Purchase Order Service', () => {
    let mockHttp: Http;

    beforeEach(() => {
        mockHttp = { get: null } as Http;

        spyOn(mockHttp, 'get').and.returnValue(Observable.of({
            json: () => mockResponse
        }));

        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                {
                    provide: Http,
                    useValue: mockHttp
                },
                PurchaseOrdersService
            ]
        });
    });

    it('should get search results from json',
        inject([PurchaseOrdersService], (purchaseOrderSrvc: PurchaseOrdersService) => {
            const expectedUrl = 'app/purchaseOrderNums.json';
            purchaseOrderSrvc.getPurchaseOrders(null, null, null, null)
                .subscribe((res) => {
                    expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
                    expect(res).toEqual(mockResponse);
                });
        })
    );

    it('should get filtered result from json',
        inject([PurchaseOrdersService], (purchaseOrderSrvc: PurchaseOrdersService) => {
            var expectedUrl = 'http://p1vmb2bls01.olqa.preol.dell.com:4000/api/purchaseorder?Id=1';
            purchaseOrderSrvc.getPurchaseOrderById('1')
                .subscribe((res) => {
                    expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
                    expect(res).toEqual(mockResponse);
                })

            expectedUrl = 'http://p1vmb2bls01.olqa.preol.dell.com:4000/api/purchaseorder?Id=2';
            purchaseOrderSrvc.getPurchaseOrderById('2')
                .subscribe((res) => {
                    expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
                    expect(res).toEqual(mockResponse);
                })
        })
    );
});