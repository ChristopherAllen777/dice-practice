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
    selector: 'suggestion-details',
    templateUrl: './SuggestionDetails.component.html'
})

export class SuggestionDetailsComponent implements OnInit {
    suggestions: ISuggestion[] = null;
    suggestion: ISuggestion = null;
    newComment: string = null;
    index: number = null;
    showLoading = true;
    showDetails = false;
    isUpvotePressed = false;
    isDownvotePressed = false;

    constructor(private commonDataService: CommonDataService, private router: Router, private http: Http,
        private metrics: MetricsService, private profiles: ProfileService) {
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Suggestion Details');
        this.metrics.sendMetric('Suggestion Details loaded')
            .subscribe(() => {
                //needed to make call
            });

        this.commonDataService.setPageTitle('Suggestion Details');
        this.commonDataService.pageChange();

        this.router.routerState.root.queryParams
            .subscribe(params => {
                if (params['index']) {
                    this.index = params['index'];
                    this.suggestions = JSON.parse(sessionStorage.getItem('suggestions'));
                    this.suggestion = this.suggestions[this.index];

                    this.showDetails = true;
                    this.showLoading = false;
                }
            });
    }

    private formatDate(date: Date) {
        return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate() + " "
            + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":"
            + ("0" + date.getMilliseconds()).slice(-2)
    }

    clearComment() {
        this.newComment = null;
    }

    voteSuggestion(isUpvote: boolean) {
        if (isUpvote) {
            this.suggestion.Upvotes++;
        }
        else {
            this.suggestion.Downvotes++;
        }
        this.recalculateApproval()
        this.suggestions[this.index].Voters[this.suggestions[this.index].Voters.length] = sessionStorage.getItem('sessionUser')

        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
    }

    recalculateApproval() {
        let upvotes = this.suggestion.Upvotes;
        let downvotes = this.suggestion.Downvotes
        let diff = upvotes - downvotes;
        let totalVotes = upvotes + downvotes;

        this.suggestion.ApprovalRate = diff / totalVotes;

        //this.suggestion.ApprovalRate = upvotes / totalVotes;
        //if (downvotes > upvotes) {
        //    this.suggestion.ApprovalRate -= 1;
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

    addComment() {
        this.suggestion.Comments[this.suggestion.Comments.length] = {
            Text: this.newComment,
            Date: this.formatDate(new Date()),
            CommentedBy: sessionStorage.getItem('sessionUser')
        }

        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
        this.newComment = null;
    }

    getBackgroundColor(isUpvote: boolean) {
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

        return {
            'background-color': '#ededed'
        }
    }

    togglePress(isUpvote: boolean, isPressed: boolean) {
        if (!isPressed) {
            this.isUpvotePressed = false;
            this.isDownvotePressed = false;
        } else {
            if (isUpvote) {
                this.isUpvotePressed = true;
            } else {
                this.isDownvotePressed = true;
            }
        }
    }
}