import {ClubAPI} from '../../api/clubs';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(ClubAPI, Router)
export class Club {
    name = 'Regina Public Library';
    club : any = {
      name: '',
      color: '#ffd777',
      key: -1
    };
    clubs;

    constructor(public api: ClubAPI, public router: Router){ }

    created(){
        this.api.getClubs()
        .then((clubs:any[]) => this.clubs = clubs)
        .catch(() => this.clubs = []);
    }

    save() {
        this.club.key = this.clubs.length;
        this.api.createClub(this.club)
        .then((club) => this.router.navigate(`club/${this.club.id}`));
    }
}
