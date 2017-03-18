import {ClubAPI} from '../../api/clubs';
import {EventAPI} from '../../api/events';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(ClubAPI, EventAPI,Router)
export class Event {
    name = 'Regina Public Library';
    clubId;
    eventId;
    event;
    editing = false;
    clubs;

    constructor(public api: ClubAPI, public eApi: EventAPI, public router: Router){ }

    activate(params){
        this.clubId = params.id;
        this.eventId = params.eid;
        this.eApi.getEvent(this.clubId, this.eventId)
        .then((event:any) => this.event = event)
        .catch(() => this.router.navigate('/'));
        this.api.getClubs()
        .then((clubs:any[]) => this.clubs = clubs)
        .catch(() => this.clubs = []);
    }

    edit() {
        this.editing = !this.editing;
    }

    save() {
        this.eApi.updateEvent(this.clubId, this.event)
        .then((event) => {
            this.editing = false;
            this.router.navigate(`club/${this.clubId}/events/${this.event.id}`);
        });
    }

    delete() {
        this.eApi.deleteEvent(this.clubId, this.event.id)
        .then(() => this.router.navigate('/'));
    }
}
