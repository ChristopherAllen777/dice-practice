import {
    fakeAsync,
    inject,
    tick,
    TestBed
} from '@angular/core/testing';
import { CommonDataService } from '../app/Common/CommonData.service';
import { IPurchaseOrder } from '../app/PurchaseOrders/PurchaseOrder';

describe('Testing Common Data Service', () => {
    beforeEach(() => {        
        TestBed.configureTestingModule({
            providers: [ CommonDataService ]
        });
    });

    it('should set/get selected PO',
        inject([CommonDataService], (commonDataService: CommonDataService) => {
            commonDataService.setSelectedPO('123');
            expect(commonDataService.getSelectedPO()).toEqual('123');
        })
    );

    it('should set/get previous page',
        inject([CommonDataService], (commonDataService: CommonDataService) => {
            let page = "testpreviouspage";
            commonDataService.setPreviousPage(page);
            expect(commonDataService.getPreviousPage()).toEqual(page);
        })
    );
});