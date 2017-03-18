import {EventAPI} from '../api/events';
import {ClubAPI} from '../api/clubs';
import {inject} from 'aurelia-framework';

@inject(EventAPI, ClubAPI)
export class Home {
    name = 'Regina Public Library';
    selected;
    events;
    clubs;

    constructor(private eApi: EventAPI, public cApi: ClubAPI){ }

    created(){
        this.eApi.getEvents()
        .then((events:any[]) => this.events = events)
        .catch(() => this.events = []);
        this.cApi.getClubs()
        .then((clubs:any[]) => this.clubs = clubs)
        .catch(() => this.clubs = []);

    }

}
