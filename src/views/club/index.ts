import {ClubAPI} from '../../api/clubs';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(ClubAPI, Router)
export class Club {
    name = 'Regina Public Library';
    clubId;
    club;
    editing = false;
    clubs;

    constructor(public api: ClubAPI, public router: Router){ }

    activate(params){
        this.clubId = params.id;
        this.api.getClubById(this.clubId)
        .then((club:any) => this.club = club)
        .catch(() => this.router.navigate('/'));
        this.api.getClubs()
        .then((clubs:any[]) => this.clubs = clubs)
        .catch(() => this.clubs = []);
    }

    edit() {
        this.editing = !this.editing;
    }

    save() {
        this.api.updateClub(this.club)
        .then((club) => {
            this.editing = false;
            this.router.navigate(`club/${this.club.id}`);
        });
    }

    delete() {
        this.api.deleteClub(this.club.id)
        .then(() => this.router.navigate('/'));
    }
}
