import * as moment from 'moment';
import {HttpClient, json} from 'aurelia-fetch-client';
import {EventEndpoint} from '../endpoints';
import {inject} from 'aurelia-framework';

export class EventAPI {

  _events;

  constructor(){ }

  getEvents(){
    return new Promise((resolve, reject) => {
        let client = new HttpClient();

        client.fetch(`${EventEndpoint}?orderBy="startDate"`, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
        .then(response => response.json())
        .then(s => {
          let list : any[] = [];
          let items = JSON.parse(JSON.stringify(s));
          Object.keys(items).forEach(k => {
              items[k].forEach(e => {
                  list.push({
                      "id": e.id,
                      "name": e.name,
                      "clubId": k,
                      "startDate": moment(e.startDate).format('MMM Do, YYYY'),
                      "endDate": moment(e.endDate).format('MMM Do, YYYY'),
                      "readers": e.readers
                  });
              });
          });
          resolve(list);
        })
        .catch(error => {
          reject();
        });
    });
  }

  getEvent(id, eid){
    return new Promise((resolve, reject) => {
      let client = new HttpClient();

      client.fetch(`${EventEndpoint}?orderBy="$key"&equalTo="${id}"`, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(s => {
        let items = JSON.parse(JSON.stringify(s));
        let item = items[id].find(i => i.id == eid);
        resolve(item);
      })
      .catch(error => {
        reject();
      });
    });
  }

  updateEvent(id, club){
    return new Promise((resolve, reject) => {
        let key = club.key;
        delete club.key;
        let client = new HttpClient();

        console.log(club);

        client.fetch(`${EventEndpoint}/${key}.json`, {
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

  createEvent(club){
    return new Promise((resolve, reject) => {
        if(!this._events) return;
        club.id = this.guid();
        club.events = [];
        this._events.push(club);

        let client = new HttpClient();

        console.log(club);

        client.fetch(`${EventEndpoint}.json`, {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: 'put',
            body: json(this._events)
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

  deleteEvent(id, eid) {
    return new Promise((resolve, reject) => {
        if(!this._events) return;

        let client = new HttpClient();

        client.fetch(`${EventEndpoint}.json`, {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: 'put',
            body: json(this._events.filter(e => e.id != eid))
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
