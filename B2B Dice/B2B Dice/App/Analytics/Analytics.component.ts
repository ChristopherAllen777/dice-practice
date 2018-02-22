import { Component } from '@angular/core';
import { CommonDataService } from '../Common/CommonData.service';
import { dragula, DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router } from '@angular/router';
import { MetricsService } from '../Common/MetricsService.service';
import { ProfileService } from '../Profile/Profile.service';
import { IProfile } from '../Profile/Profile';

@Component({
    selector: 'analytics',
    templateUrl: './Analytics.component.html'
})

export class AnalyticsComponent {
    urls: string[] = [];
    newUrl = '';
    urlRequired = false;
    profile: IProfile = null;

    constructor(private commonDataService: CommonDataService, private dragulaService: DragulaService,
        private metrics: MetricsService, private profiles: ProfileService, private router: Router) {
        //this.urls = ['http://10.164.33.167:5601/app/kibana#/visualize/edit/8484a800-a227-11e7-bb50-ed4c862531ab?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2FM%2Cmode%3Aquick%2Cto%3Anow%2FM))', 'http://10.164.33.167:5601/app/kibana#/visualize/edit/6c70de50-a227-11e7-bb50-ed4c862531ab?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2FM%2Cmode%3Aquick%2Cto%3Anow%2FM))', 'https://www.wikipedia.org/wiki/Main_Page'];
        //this.urls = ['https://www.wikipedia.org/wiki/Main_Page', 'https://en.wikipedia.org/wiki/Dell', 'https://en.wikipedia.org/wiki/AngularJS'];

        const bag: any = this.dragulaService.find('first-bag');
        if (bag !== undefined) this.dragulaService.destroy('first-bag');
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Analytics');
        this.metrics.sendMetric('Page loaded')
            .subscribe(() => {
                //needed to make call
            });

        this.commonDataService.setPageTitle('Analytics');
        this.commonDataService.pageChange();

        this.dragulaService.drag.subscribe((value: any) => {
            this.onDrag(value.slice(1));
        });

        this.dragulaService.dragend.subscribe((value: any) => {
            this.onDragEnd(value.slice(1));
        });

        this.dragulaService.over.subscribe((value: any) => {
            this.onOver(value.slice(1));
        });

        this.dragulaService.out.subscribe((value: any) => {
            this.onOut(value.slice(1));
        });

        this.dragulaService.setOptions('first-bag', {
            invalid: function (el: any, handle: any) {
                return handle.className.indexOf('handle') == -1;
            }
        });

        this.urls.push('http://10.164.33.167:5601/goto/e41814ecc04ea8318e8e4fa6555fc730?embed=true');
        this.profile = JSON.parse(sessionStorage.getItem('profile'));
        for (let url of this.profile.DashboardUrls) {
            this.urls.push(url);
        }
    }

    addUrl(url: string) {
        if (url != '') {
            this.urlRequired = false;
            this.urls.push(url);
            this.newUrl = '';
            this.profile.DashboardUrls.push(url);
            this.updateProfile();
        } else {
            this.urlRequired = true;
        }

    }

    clearUrl() {
        this.newUrl = '';
    }

    removeUrl(url: string) {
        this.urls.splice(this.urls.indexOf(url), 1);
        this.profile.DashboardUrls.splice(this.profile.DashboardUrls.indexOf(url), 1);
        this.updateProfile();
    }

    updateProfile() {
        console.log(this.profile);
        this.profile.LastUpdate = new Date();
        sessionStorage.setItem('profile', JSON.stringify(this.profile));
        this.profiles.updateProfile()
            .subscribe(() => {
                //needed to make call
            });
    }

    public onDrag(args: any) {
        let [e, el] = args;
        e.querySelectorAll('.blank').forEach(function (item: any) {
            item.style.display = "block";
        });
    }

    public onDragEnd(args: any) {
        let [e, el] = args;
        e.querySelectorAll('.blank').forEach(function (item: any) {
            item.style.display = "none";
        });
    }

    public onOver(args: any) {
        let [e, el, container] = args;
        container.querySelectorAll('.blank').forEach(function (item: any) {
            item.style.display = "block";
        });
    }

    public onOut(args: any) {
        let [e, el, container] = args;
        container.querySelectorAll('.blank').forEach(function (item: any) {
            item.style.display = "none";
        });
    }

}