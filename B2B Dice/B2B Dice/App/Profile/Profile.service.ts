import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONSTANTS } from '../Common/CONSTANTS';
import 'rxjs/add/operator/map';
import { IProfile } from './Profile'

@Injectable()
export class ProfileService {
    constructor(private _http: Http) { }

    getProfile(profileId: string) {
        return this._http.get(CONSTANTS._diceApiUrl() + '/UserProfile?ProfileID=' + profileId)
            .map((response: Response) => response.json());
    }

    updateProfile() {
        var profile: IProfile = JSON.parse(sessionStorage.getItem('profile'));
        return this._http.post(CONSTANTS._diceApiUrl() + '/UserProfile', profile)
            .map((response: Response) => response.json());
    }
}