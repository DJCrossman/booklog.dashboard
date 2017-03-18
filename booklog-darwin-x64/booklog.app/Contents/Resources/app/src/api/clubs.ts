import * as moment from 'moment';
import {HttpClient, json} from 'aurelia-fetch-client';
import {ClubEndpoint} from '../endpoints';
import {inject} from 'aurelia-framework';

export class ClubAPI {

  _clubs;

  constructor(){ }

  getClubs(){
    return new Promise((resolve, reject) => {
        let client = new HttpClient();

        client.fetch(`${ClubEndpoint}.json?orderBy="name"`, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
        .then(response => response.json())
        .then(s => {
          let list : any[] = [];
          this._clubs = JSON.parse(JSON.stringify(s));
          this._clubs.forEach(k => {
              let events : any[] = [];
              if(k.events) {
                  k.events.forEach(e => {
                      events.push({
                          id: e.id,
                          name: e.name,
                          startDate: moment(e.startDate).format('MMM Do, YYYY'),
                          endDate: moment(e.endDate).format('MMM Do, YYYY')
                      });
                  });
              } else {
                  events = [];
              }
              list.push({
                  id: k.id,
                  name: k.name,
                  color: k.color,
                  events: events,
                  readers: k.readers
              });
          });
          resolve(list);
        })
        .catch(error => {
          reject();
        });
    });
  }

  getClubById(id){
    return new Promise((resolve, reject) => {
      let client = new HttpClient();

      client.fetch(`${ClubEndpoint}.json?orderBy="id"&equalTo="${id}"`, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(s => {
        let item : any;
        let items = JSON.parse(JSON.stringify(s));
        Object.keys(items).forEach(k => {
            if(items[k].id == id) {
                item = items[k];
                item.key = k;
            }
        });
        console.log(item);
        resolve(item);
      })
      .catch(error => {
        reject();
      });
    });
  }

  updateClub(club){
    return new Promise((resolve, reject) => {
        let key = club.key;
        delete club.key;
        let client = new HttpClient();

        console.log(club);

        client.fetch(`${ClubEndpoint}/${key}.json`, {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: 'put',
            body: json(club)
        })
        .then(s => {
          resolve(club);
        })
        .catch(error => {
          alert(error);
          reject();
        });
      });
  }

  createClub(club){
    return new Promise((resolve, reject) => {
        if(!this._clubs) return;
        club.id = this.guid();
        club.events = [];
        this._clubs.push(club);

        let client = new HttpClient();

        console.log(club);

        client.fetch(`${ClubEndpoint}.json`, {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: 'put',
            body: json(this._clubs)
        })
        .then(s => {
          resolve(club);
        })
        .catch(error => {
          alert(error);
          reject();
        });
    });
  }

  deleteClub(id) {
    return new Promise((resolve, reject) => {
        if(!this._clubs) return;

        let client = new HttpClient();

        client.fetch(`${ClubEndpoint}.json`, {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: 'put',
            body: json(this._clubs.filter(c => c.id != id))
        })
        .then(s => {
          resolve();
        })
        .catch(error => {
          alert(error);
          reject();
        });
    });
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
};
