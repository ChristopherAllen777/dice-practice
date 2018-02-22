import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../Common/CommonData.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { IHeaderLink } from './HeaderLink';
import { UUID } from 'angular2-uuid';
import { MetricsService } from '../Common/MetricsService.service';
import { ProfileService } from '../Profile/Profile.service';
import { IProfile } from '../Profile/Profile';
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/finally';

@Component({
    selector: 'my-nav',
    templateUrl: './NavBar.component.html'
})

export class NavBarComponent implements OnInit {
    headerLinks: IHeaderLink[] = [
        //{
        //    Id: 'po-browse-link',
        //    Text: "Browse PO",
        //    Href: '/browse/purchase-orders'
        //},
        {
            Id: 'po-track-link',
            Text: "Track PO",
            Href: '/track/purchase-orders'
        },
        //{
        //    Id: 'customer-search-link',
        //    Text: "Search Customer",
        //    Href: '/search/customers'
        //},
        {
            Id: 'search-link',
            Text: "Search",
            Href: '/search'
        },
        {
            Id: 'analytics-link',
            Text: "Analytics",
            Href: '/analytics'
        },
        {
            Id: 'suggestions-link',
            Text: "Suggestions",
            Href: '/suggestions'
        }];
    purchaseOrderNum: string = '';
    username: string = '';
    pageTitle = '';
    pageTitleListener: Subscription = null;

    constructor(private commonDataService: CommonDataService, private router: Router, private http: Http,
        private metrics: MetricsService, private profiles: ProfileService) {
        if (!sessionStorage.getItem('sessionUser')) {
            this.http.get(document.baseURI + 'api/Auth')
                .finally(() => {
                    if (!sessionStorage.getItem('sessionID')) {
                        sessionStorage.setItem('sessionID', UUID.UUID());
                    }
                })
                .subscribe(result => {
                    var usernameDirty: string = result.json();
                    var usernameIndex = usernameDirty.lastIndexOf('\\') + 1;
                    this.username = usernameDirty.substr(usernameIndex, usernameDirty.length - usernameIndex);
                    sessionStorage.setItem('sessionUser', this.username);

                    this.profiles.getProfile(this.username)
                        .subscribe((profile) => {
                            sessionStorage.setItem('profile', JSON.stringify(profile));
                        });
                });
        }
        else {
            this.username = sessionStorage.getItem('sessionUser')
        }
    }

    ngOnInit() {
        this.pageTitleListener = this.commonDataService.onPageChange.subscribe(() => {
            this.pageTitle = this.commonDataService.getPageTitle();
        })
    }

    ngOnDestroy() {
        this.pageTitleListener.unsubscribe();
    }

    clearPO() {
        this.purchaseOrderNum = '';
    }

    searchPO(poNum: string) {
        if (poNum != '') {
            window.open('#/track/purchase-orders?poNum=' + poNum, '_blank');
        }
    }
}