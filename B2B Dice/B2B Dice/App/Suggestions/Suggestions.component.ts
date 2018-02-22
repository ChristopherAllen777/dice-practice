import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../Common/CommonData.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { UUID } from 'angular2-uuid';
import { MetricsService } from '../Common/MetricsService.service';
import { ProfileService } from '../Profile/Profile.service';
import { IProfile } from '../Profile/Profile';
import { ISuggestion } from './Suggestion'
import { Subscription } from "rxjs/Subscription";
import { PagerService } from '../Common/Pager.service';
import 'rxjs/add/operator/finally';

@Component({
    selector: 'suggestions',
    templateUrl: './Suggestions.component.html'
})

export class SuggestionsComponent implements OnInit {
    suggestions: ISuggestion[] = [{
        Title: 'Add Fancy Pictures',
        Description: 'I think the white background is kind of plain and needs to be fancier',
        CreatedBy: 'Bob_Smith',
        CreatedDate: this.formatDate(new Date()),
        Upvotes: 5,
        Downvotes: 2,
        ApprovalRate: 0.429,
        Voters: ['Bob_Smith', 'T_Staley'],
        Comments: []
    }, {
        Title: 'Pay my taxes',
        Description: 'I buy so many computers that Dell should pay my taxes for me',
        CreatedBy: 'Jane_Jones',
        CreatedDate: this.formatDate(new Date()),
        Upvotes: 1000,
        Downvotes: 2,
        ApprovalRate: 0.996,
        Voters: ['Jane_Jones'],
        Comments: [{
            Text: "I AGREE!!!",
            CommentedBy: "Bob_Smith",
            Date: this.formatDate(new Date())
        }, {
            Text: "Me too, taxes are horrible.  Please pay mine as well.",
            CommentedBy: "Michael Dell",
            Date: this.formatDate(new Date())
        }]
    }, {
        Title: 'Blow up the moon',
        Description: 'The moon is so bright it keeps me up at night, please get rid of it',
        CreatedBy: 'Bob_Smith',
        CreatedDate: this.formatDate(new Date()),
        Upvotes: 2,
        Downvotes: 10,
        ApprovalRate: -0.667,
        Voters: ['Bob_Smith'],
        Comments: []
    }]

    pager: any = {};
    page: number = 0;
    pageSize: number = 100;
    total: number = 3;
    sortColumn = "";
    sortOrder = "";

    counts: number[] = [5, 10, 25, 50, 100];

    newTitle: string = null;
    newDescription: string = null;
    isUpvotePressed = false;
    isDownvotePressed = false;
    clickedIndex: number = null;
    filterTitle: string = null;

    constructor(private commonDataService: CommonDataService, private router: Router, private http: Http,
        private metrics: MetricsService, private pagerService: PagerService, private profiles: ProfileService) {
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Suggestions');
        this.metrics.sendMetric('Suggestions loaded')
            .subscribe(() => {
                //needed to make call
            });

        this.commonDataService.setPageTitle('Suggestions');
        this.commonDataService.pageChange();

        this.getSuggestions();
        this.pager = this.pagerService.getPager(this.total, this.page, this.pageSize);
        this.setPage(1);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.page = page;
        this.pager = this.pagerService.getPager(this.total, this.page, this.pageSize);
        //this.getSuggestions();
    }

    setPageSize(size: number) {
        this.pageSize = size;
        this.setPage(1)
    }

    setSort(sortCol: string) {
        if (this.sortColumn != sortCol) {
            this.sortColumn = sortCol;
            this.sortOrder = "asc";
        }
        else {
            if (this.sortOrder == "asc") {
                this.sortOrder = "desc";
            }
            else {
                this.sortOrder = "asc";
            }
        }
        console.log(this.sortColumn);
        console.log(this.sortOrder);
        //this.getSuggestions();
    }

    private formatDate(date: Date) {
        return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate() + " "
            + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":"
            + ("0" + date.getMilliseconds()).slice(-2)
    }

    clearTitle() {
        this.newTitle = null;
    }

    clearDescription() {
        this.newDescription = null;
    }

    getSuggestions() {
        if (!sessionStorage.getItem('suggestions')) {
            sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
        }
        else {
            this.suggestions = JSON.parse(sessionStorage.getItem('suggestions'))
        }
    }

    voteSuggestion(index: number, isUpvote: boolean) {
        if (isUpvote) {
            this.suggestions[index].Upvotes++;
        }
        else {
            this.suggestions[index].Downvotes++;
        }
        this.recalculateApproval(index)
        this.suggestions[index].Voters[this.suggestions[index].Voters.length] = sessionStorage.getItem('sessionUser')

        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
    }

    recalculateApproval(index: number) {
        let upvotes = this.suggestions[index].Upvotes;
        let downvotes = this.suggestions[index].Downvotes
        let diff = upvotes - downvotes;
        let totalVotes = upvotes + downvotes;

        this.suggestions[index].ApprovalRate = diff / totalVotes;
        //if (downvotes > upvotes) {
        //    this.suggestions[index].ApprovalRate -= 1;
        //}
    }

    getTextColor(rate: number) {
        if (rate > 0) {
            return {
                'color': '#009900'
            }
        }
        else if (rate < 0) {
            return {
                'color': '#cc0000'
            }
        }
        return {
            'color': '#000000'
        }
    }

    addSuggestion() {
        this.suggestions[this.suggestions.length] = {
            Title: this.newTitle,
            Description: this.newDescription,
            CreatedBy: sessionStorage.getItem('sessionUser'),
            CreatedDate: this.formatDate(new Date()),
            Upvotes: 0,
            Downvotes: 0,
            ApprovalRate: 0,
            Voters: [],
            Comments: []
        }

        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
        this.newTitle = null;
        this.newDescription = null;
    }

    getBackgroundColor(isUpvote: boolean, index: number) {
        if (this.clickedIndex == index) {
            if (isUpvote && this.isUpvotePressed) {
                return {
                    'background-color': 'lawngreen'
                }
            }
            if (!isUpvote && this.isDownvotePressed) {
                return {
                    'background-color': 'red'
                }
            }
        }

        return {
            'background-color': '#ededed'
        }
    }

    togglePress(isUpvote: boolean, isPressed: boolean, index: number) {
        if (!isPressed) {
            this.isUpvotePressed = false;
            this.isDownvotePressed = false;
            this.clickedIndex = null;
        } else {
            if (isUpvote) {
                this.isUpvotePressed = true;
            } else {
                this.isDownvotePressed = true;
            }
            this.clickedIndex = index;
        }
    }

    clearFilterTitle() {
        this.filterTitle = null;
    }

    getFilterValue(compareTitle: string) {
        return this.filterTitle == null || this.filterTitle == ''
            || (compareTitle.toLowerCase().indexOf(this.filterTitle.toLowerCase()) > -1)
    }
}