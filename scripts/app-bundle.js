define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Booklog';
            config.map([
                { route: 'club/:id/events/:eid', moduleId: 'views/events/index', title: 'Event Details' },
                { route: 'club/create', moduleId: 'views/club/create', title: 'Create Club' },
                { route: 'club/:id', moduleId: 'views/club/index', title: 'Club Details' },
                { route: '', moduleId: 'views/index', title: 'Dashboard' }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

define('endpoints',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventEndpoint = 'https://booklog-9c5b1.firebaseio.com/events.json';
    exports.EventEndpoint = EventEndpoint;
    var ClubEndpoint = 'https://booklog-9c5b1.firebaseio.com/clubs';
    exports.ClubEndpoint = ClubEndpoint;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment", "fetch"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('api/clubs',["require", "exports", "moment", "aurelia-fetch-client", "../endpoints"], function (require, exports, moment, aurelia_fetch_client_1, endpoints_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClubAPI = (function () {
        function ClubAPI() {
        }
        ClubAPI.prototype.getClubs = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var client = new aurelia_fetch_client_1.HttpClient();
                client.fetch(endpoints_1.ClubEndpoint + ".json?orderBy=\"name\"", { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
                    .then(function (response) { return response.json(); })
                    .then(function (s) {
                    var list = [];
                    _this._clubs = JSON.parse(JSON.stringify(s));
                    _this._clubs.forEach(function (k) {
                        var events = [];
                        if (k.events) {
                            k.events.forEach(function (e) {
                                events.push({
                                    id: e.id,
                                    name: e.name,
                                    startDate: moment(e.startDate).format('MMM Do, YYYY'),
                                    endDate: moment(e.endDate).format('MMM Do, YYYY')
                                });
                            });
                        }
                        else {
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
                    .catch(function (error) {
                    reject();
                });
            });
        };
        ClubAPI.prototype.getClubById = function (id) {
            return new Promise(function (resolve, reject) {
                var client = new aurelia_fetch_client_1.HttpClient();
                client.fetch(endpoints_1.ClubEndpoint + ".json?orderBy=\"id\"&equalTo=\"" + id + "\"", { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
                    .then(function (response) { return response.json(); })
                    .then(function (s) {
                    var item;
                    var items = JSON.parse(JSON.stringify(s));
                    Object.keys(items).forEach(function (k) {
                        if (items[k].id == id) {
                            item = items[k];
                            item.key = k;
                        }
                    });
                    console.log(item);
                    resolve(item);
                })
                    .catch(function (error) {
                    reject();
                });
            });
        };
        ClubAPI.prototype.updateClub = function (club) {
            return new Promise(function (resolve, reject) {
                var key = club.key;
                delete club.key;
                var client = new aurelia_fetch_client_1.HttpClient();
                console.log(club);
                client.fetch(endpoints_1.ClubEndpoint + "/" + key + ".json", {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    method: 'put',
                    body: aurelia_fetch_client_1.json(club)
                })
                    .then(function (s) {
                    resolve(club);
                })
                    .catch(function (error) {
                    alert(error);
                    reject();
                });
            });
        };
        ClubAPI.prototype.createClub = function (club) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._clubs)
                    return;
                club.id = _this.guid();
                club.events = [];
                _this._clubs.push(club);
                var client = new aurelia_fetch_client_1.HttpClient();
                console.log(club);
                client.fetch(endpoints_1.ClubEndpoint + ".json", {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    method: 'put',
                    body: aurelia_fetch_client_1.json(_this._clubs)
                })
                    .then(function (s) {
                    resolve(club);
                })
                    .catch(function (error) {
                    alert(error);
                    reject();
                });
            });
        };
        ClubAPI.prototype.deleteClub = function (id) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._clubs)
                    return;
                var client = new aurelia_fetch_client_1.HttpClient();
                client.fetch(endpoints_1.ClubEndpoint + ".json", {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    method: 'put',
                    body: aurelia_fetch_client_1.json(_this._clubs.filter(function (c) { return c.id != id; }))
                })
                    .then(function (s) {
                    resolve();
                })
                    .catch(function (error) {
                    alert(error);
                    reject();
                });
            });
        };
        ClubAPI.prototype.guid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
        return ClubAPI;
    }());
    exports.ClubAPI = ClubAPI;
    ;
});

define('api/events',["require", "exports", "moment", "aurelia-fetch-client", "../endpoints"], function (require, exports, moment, aurelia_fetch_client_1, endpoints_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventAPI = (function () {
        function EventAPI() {
        }
        EventAPI.prototype.getEvents = function () {
            return new Promise(function (resolve, reject) {
                var client = new aurelia_fetch_client_1.HttpClient();
                client.fetch(endpoints_1.EventEndpoint + "?orderBy=\"startDate\"", { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
                    .then(function (response) { return response.json(); })
                    .then(function (s) {
                    var list = [];
                    var items = JSON.parse(JSON.stringify(s));
                    Object.keys(items).forEach(function (k) {
                        items[k].forEach(function (e) {
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
                    .catch(function (error) {
                    reject();
                });
            });
        };
        EventAPI.prototype.getEvent = function (id, eid) {
            return new Promise(function (resolve, reject) {
                var client = new aurelia_fetch_client_1.HttpClient();
                client.fetch(endpoints_1.EventEndpoint + "?orderBy=\"$key\"&equalTo=\"" + id + "\"", { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
                    .then(function (response) { return response.json(); })
                    .then(function (s) {
                    var items = JSON.parse(JSON.stringify(s));
                    var item = items[id].find(function (i) { return i.id == eid; });
                    resolve(item);
                })
                    .catch(function (error) {
                    reject();
                });
            });
        };
        EventAPI.prototype.updateEvent = function (id, club) {
            return new Promise(function (resolve, reject) {
                var key = club.key;
                delete club.key;
                var client = new aurelia_fetch_client_1.HttpClient();
                console.log(club);
                client.fetch(endpoints_1.EventEndpoint + "/" + key + ".json", {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    method: 'put',
                    body: aurelia_fetch_client_1.json(club)
                })
                    .then(function (s) {
                    resolve(club);
                })
                    .catch(function (error) {
                    alert(error);
                    reject();
                });
            });
        };
        EventAPI.prototype.createEvent = function (club) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._events)
                    return;
                club.id = _this.guid();
                club.events = [];
                _this._events.push(club);
                var client = new aurelia_fetch_client_1.HttpClient();
                console.log(club);
                client.fetch(endpoints_1.EventEndpoint + ".json", {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    method: 'put',
                    body: aurelia_fetch_client_1.json(_this._events)
                })
                    .then(function (s) {
                    resolve(club);
                })
                    .catch(function (error) {
                    alert(error);
                    reject();
                });
            });
        };
        EventAPI.prototype.deleteEvent = function (id, eid) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._events)
                    return;
                var client = new aurelia_fetch_client_1.HttpClient();
                client.fetch(endpoints_1.EventEndpoint + ".json", {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    method: 'put',
                    body: aurelia_fetch_client_1.json(_this._events.filter(function (e) { return e.id != eid; }))
                })
                    .then(function (s) {
                    resolve();
                })
                    .catch(function (error) {
                    alert(error);
                    reject();
                });
            });
        };
        EventAPI.prototype.guid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
        return EventAPI;
    }());
    exports.EventAPI = EventAPI;
    ;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/index',["require", "exports", "../api/events", "../api/clubs", "aurelia-framework"], function (require, exports, events_1, clubs_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Home = (function () {
        function Home(eApi, cApi) {
            this.eApi = eApi;
            this.cApi = cApi;
            this.name = 'Regina Public Library';
        }
        Home.prototype.created = function () {
            var _this = this;
            this.eApi.getEvents()
                .then(function (events) { return _this.events = events; })
                .catch(function () { return _this.events = []; });
            this.cApi.getClubs()
                .then(function (clubs) { return _this.clubs = clubs; })
                .catch(function () { return _this.clubs = []; });
        };
        return Home;
    }());
    Home = __decorate([
        aurelia_framework_1.inject(events_1.EventAPI, clubs_1.ClubAPI),
        __metadata("design:paramtypes", [events_1.EventAPI, clubs_1.ClubAPI])
    ], Home);
    exports.Home = Home;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/club/create',["require", "exports", "../../api/clubs", "aurelia-router", "aurelia-framework"], function (require, exports, clubs_1, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Club = (function () {
        function Club(api, router) {
            this.api = api;
            this.router = router;
            this.name = 'Regina Public Library';
            this.club = {
                name: '',
                color: '#ffd777',
                key: -1
            };
        }
        Club.prototype.created = function () {
            var _this = this;
            this.api.getClubs()
                .then(function (clubs) { return _this.clubs = clubs; })
                .catch(function () { return _this.clubs = []; });
        };
        Club.prototype.save = function () {
            var _this = this;
            this.club.key = this.clubs.length;
            this.api.createClub(this.club)
                .then(function (club) { return _this.router.navigate("club/" + _this.club.id); });
        };
        return Club;
    }());
    Club = __decorate([
        aurelia_framework_1.inject(clubs_1.ClubAPI, aurelia_router_1.Router),
        __metadata("design:paramtypes", [clubs_1.ClubAPI, aurelia_router_1.Router])
    ], Club);
    exports.Club = Club;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/club/index',["require", "exports", "../../api/clubs", "aurelia-router", "aurelia-framework"], function (require, exports, clubs_1, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Club = (function () {
        function Club(api, router) {
            this.api = api;
            this.router = router;
            this.name = 'Regina Public Library';
            this.editing = false;
        }
        Club.prototype.activate = function (params) {
            var _this = this;
            this.clubId = params.id;
            this.api.getClubById(this.clubId)
                .then(function (club) { return _this.club = club; })
                .catch(function () { return _this.router.navigate('/'); });
            this.api.getClubs()
                .then(function (clubs) { return _this.clubs = clubs; })
                .catch(function () { return _this.clubs = []; });
        };
        Club.prototype.edit = function () {
            this.editing = !this.editing;
        };
        Club.prototype.save = function () {
            var _this = this;
            this.api.updateClub(this.club)
                .then(function (club) {
                _this.editing = false;
                _this.router.navigate("club/" + _this.club.id);
            });
        };
        Club.prototype.delete = function () {
            var _this = this;
            this.api.deleteClub(this.club.id)
                .then(function () { return _this.router.navigate('/'); });
        };
        return Club;
    }());
    Club = __decorate([
        aurelia_framework_1.inject(clubs_1.ClubAPI, aurelia_router_1.Router),
        __metadata("design:paramtypes", [clubs_1.ClubAPI, aurelia_router_1.Router])
    ], Club);
    exports.Club = Club;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/events/index',["require", "exports", "../../api/clubs", "../../api/events", "aurelia-router", "aurelia-framework"], function (require, exports, clubs_1, events_1, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Event = (function () {
        function Event(api, eApi, router) {
            this.api = api;
            this.eApi = eApi;
            this.router = router;
            this.name = 'Regina Public Library';
            this.editing = false;
        }
        Event.prototype.activate = function (params) {
            var _this = this;
            this.clubId = params.id;
            this.eventId = params.eid;
            this.eApi.getEvent(this.clubId, this.eventId)
                .then(function (event) { return _this.event = event; })
                .catch(function () { return _this.router.navigate('/'); });
            this.api.getClubs()
                .then(function (clubs) { return _this.clubs = clubs; })
                .catch(function () { return _this.clubs = []; });
        };
        Event.prototype.edit = function () {
            this.editing = !this.editing;
        };
        Event.prototype.save = function () {
            var _this = this;
            this.eApi.updateEvent(this.clubId, this.event)
                .then(function (event) {
                _this.editing = false;
                _this.router.navigate("club/" + _this.clubId + "/events/" + _this.event.id);
            });
        };
        Event.prototype.delete = function () {
            var _this = this;
            this.eApi.deleteEvent(this.clubId, this.event.id)
                .then(function () { return _this.router.navigate('/'); });
        };
        return Event;
    }());
    Event = __decorate([
        aurelia_framework_1.inject(clubs_1.ClubAPI, events_1.EventAPI, aurelia_router_1.Router),
        __metadata("design:paramtypes", [clubs_1.ClubAPI, events_1.EventAPI, aurelia_router_1.Router])
    ], Event);
    exports.Event = Event;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\n\n  <section id=\"container\" >\n      <!-- **********************************************************************************************************************************************************\n      TOP BAR CONTENT & NOTIFICATIONS\n      *********************************************************************************************************************************************************** -->\n      <!--header start-->\n      <header class=\"header black-bg\">\n            <div class=\"sidebar-toggle-box\">\n                <div class=\"fa fa-bars tooltips\" data-placement=\"right\" data-original-title=\"Toggle Navigation\"></div>\n            </div>\n          <!--logo start-->\n          <a href=\"#\" class=\"logo\"><b>BOOKLOG</b></a>\n          <!--logo end-->\n          <div class=\"top-menu\">\n          \t<ul class=\"nav pull-right top-menu\">\n                  <li><a class=\"logout\" href=\"login.html\">Logout</a></li>\n          \t</ul>\n          </div>\n      </header>\n      <!--header end-->\n\n      <router-view></router-view>\n\n      <!--main content end-->\n      <!--footer start-->\n      <footer class=\"site-footer\">\n          <div class=\"text-center\">\n              © 1997-2017 Regina Public Library\n              <a href=\"#\" class=\"go-top\">\n                  <i class=\"fa fa-angle-up\"></i>\n              </a>\n          </div>\n      </footer>\n      <!--footer end-->\n  </section>\n</template>\n"; });
define('text!views/index.html', ['module'], function(module) { module.exports = "<template>\n  <!-- **********************************************************************************************************************************************************\n  MAIN SIDEBAR MENU\n  *********************************************************************************************************************************************************** -->\n  <!--sidebar start-->\n  <aside>\n      <div id=\"sidebar\"  class=\"nav-collapse \">\n          <!-- sidebar menu start-->\n          <ul class=\"sidebar-menu\" id=\"nav-accordion\">\n\n              <p class=\"centered\"><a href=\"profile.html\"><img src=\"assets/img/small_logo.jpg\" class=\"img-circle\" width=\"60\"></a></p>\n              <h5 class=\"centered\">${name}</h5>\n\n              <li class=\"mt\">\n                  <a class=\"active\" href=\"#\">\n                      <i class=\"fa fa-dashboard\"></i>\n                      <span>Dashboard</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\" repeat.for=\"club of clubs\">\n                  <a href=\"#club/${club.id}\">\n                      <i class=\"fa fa-users\"></i>\n                      <span>${club.name}</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\">\n                  <a href=\"#club/create\">\n                  <span>Create a new club +</span>\n                  </a>\n              </li>\n\n          </ul>\n          <!-- sidebar menu end-->\n      </div>\n  </aside>\n  <!--sidebar end-->\n\n  <!-- **********************************************************************************************************************************************************\n  MAIN CONTENT\n  *********************************************************************************************************************************************************** -->\n  <!--main content start-->\n  <section id=\"main-content\">\n      <section class=\"wrapper\">\n\n          <div class=\"row\">\n              <div class=\"col-lg-9 main-chart\">\n\n                <div class=\"row mtbox\">\n                  <div class=\"col-md-2 col-sm-2 col-md-offset-1 box0\">\n                    <div class=\"box1\">\n              <span class=\"li_heart\"></span>\n              <h3>933</h3>\n                    </div>\n              <p>933 People liked your page the last 24hs. Whoohoo!</p>\n                  </div>\n                  <div class=\"col-md-2 col-sm-2 box0\">\n                    <div class=\"box1\">\n              <span class=\"li_cloud\"></span>\n              <h3>+48</h3>\n                    </div>\n              <p>48 New files were added in your cloud storage.</p>\n                  </div>\n                  <div class=\"col-md-2 col-sm-2 box0\">\n                    <div class=\"box1\">\n              <span class=\"li_stack\"></span>\n              <h3>23</h3>\n                    </div>\n              <p>You have 23 unread messages in your inbox.</p>\n                  </div>\n                  <div class=\"col-md-2 col-sm-2 box0\">\n                    <div class=\"box1\">\n              <span class=\"li_news\"></span>\n              <h3>+10</h3>\n                    </div>\n              <p>More than 10 news were added in your reader.</p>\n                  </div>\n                  <div class=\"col-md-2 col-sm-2 box0\">\n                    <div class=\"box1\">\n              <span class=\"li_data\"></span>\n              <h3>OK!</h3>\n                    </div>\n              <p>Your server is working perfectly. Relax & enjoy.</p>\n                  </div>\n\n                </div><!-- /row mt -->\n\n\n                  <div class=\"row mt\">\n\n\n        <div class=\"col-md-4 mb\" repeat.for=\"event of events\">\n          <a href=\"#club/${event.clubId}/events/${event.id}\">\n            <!-- WHITE PANEL - TOP USER -->\n            <div class=\"white-panel pn\">\n              <div class=\"white-header\">\n                <h5>${event.name}</h5>\n              </div>\n              <p><img src=\"assets/img/ui-danro.jpg\" class=\"img-circle\" width=\"80\"></p>\n              <p><b></b></p>\n              <div class=\"row\">\n                <div class=\"col-md-6\">\n                  <p class=\"small mt\"># OF READERS</p>\n                  <p>${event.readers.length}</p>\n                </div>\n                <div class=\"col-md-6\">\n                  <p class=\"small mt\">END DATE</p>\n                  <p>${event.endDate}</p>\n                </div>\n              </div>\n            </div>\n          </a>\n        </div><!-- /col-md-4 -->\n\n\n      </div><!-- /row -->\n      </div><!-- /col-lg-9 END SECTION MIDDLE -->\n\n\n\n              </div><!-- /col-lg-3 -->\n          </div><! --/row -->\n      </section>\n  </section>\n</template>\n"; });
define('text!views/club/create.html', ['module'], function(module) { module.exports = "<template>\n  <!-- **********************************************************************************************************************************************************\n  MAIN SIDEBAR MENU\n  *********************************************************************************************************************************************************** -->\n  <!--sidebar start-->\n  <aside>\n      <div id=\"sidebar\"  class=\"nav-collapse \">\n          <!-- sidebar menu start-->\n          <ul class=\"sidebar-menu\" id=\"nav-accordion\">\n\n              <p class=\"centered\"><a href=\"profile.html\"><img src=\"assets/img/small_logo.jpg\" class=\"img-circle\" width=\"60\"></a></p>\n              <h5 class=\"centered\">${name}</h5>\n\n              <li class=\"mt\">\n                  <a href=\"#\">\n                      <i class=\"fa fa-dashboard\"></i>\n                      <span>Dashboard</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\" repeat.for=\"c of clubs\">\n                  <a href=\"#club/${c.id}\">\n                      <i class=\"fa fa-users\"></i>\n                      <span>${c.name}</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\">\n                  <a class=\"active\" href=\"#club/create\">\n                  <span>Create a new club +</span>\n                  </a>\n              </li>\n\n          </ul>\n          <!-- sidebar menu end-->\n      </div>\n  </aside>\n  <!--sidebar end-->\n\n  <!-- **********************************************************************************************************************************************************\n  MAIN CONTENT\n  *********************************************************************************************************************************************************** -->\n  <!--main content start-->\n  <section id=\"main-content\">\n      <section class=\"wrapper\">\n          <div class=\"row\">\n            <div class=\"col-xs-12\">\n              <h1>${club.name ? club.name : 'Create club'}</h1>\n            </div>\n            <div class=\"col-xs-12\">\n              <form>\n                <div class=\"form-group\">\n                  <label for=\"club.name\">Name</label>\n                  <input class=\"form-control\" value.two-way=\"club.name\" placeholder=\"Enter name here...\">\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"club.color\">Color</label>\n                  <input class=\"form-control\" id=\"club.color\" value.two-way=\"club.color\" placeholder=\"Enter hex color here...\">\n                </div>\n                <button type=\"button\" class=\"btn btn-primary\" click.delegate=\"save()\">Create</button>\n              </form>\n            </div>\n            <div\n          </div>\n      </section>\n  </section>\n</template>\n"; });
define('text!views/club/index.html', ['module'], function(module) { module.exports = "<template>\n  <!-- **********************************************************************************************************************************************************\n  MAIN SIDEBAR MENU\n  *********************************************************************************************************************************************************** -->\n  <!--sidebar start-->\n  <aside>\n      <div id=\"sidebar\"  class=\"nav-collapse \">\n          <!-- sidebar menu start-->\n          <ul class=\"sidebar-menu\" id=\"nav-accordion\">\n\n              <p class=\"centered\"><a href=\"profile.html\"><img src=\"assets/img/small_logo.jpg\" class=\"img-circle\" width=\"60\"></a></p>\n              <h5 class=\"centered\">${name}</h5>\n\n              <li class=\"mt\">\n                  <a href=\"#\">\n                      <i class=\"fa fa-dashboard\"></i>\n                      <span>Dashboard</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\" repeat.for=\"c of clubs\">\n                  <a class=\"${clubId == c.id ? 'active' : ''}\" href=\"#club/${c.id}\">\n                      <i class=\"fa fa-users\"></i>\n                      <span>${c.name}</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\">\n                  <a href=\"#club/create\">\n                  <span>Create a new club +</span>\n                  </a>\n              </li>\n\n          </ul>\n          <!-- sidebar menu end-->\n      </div>\n  </aside>\n  <!--sidebar end-->\n\n  <!-- **********************************************************************************************************************************************************\n  MAIN CONTENT\n  *********************************************************************************************************************************************************** -->\n  <!--main content start-->\n  <section id=\"main-content\">\n      <section class=\"wrapper\">\n          <div class=\"row\">\n            <div class=\"col-xs-12\">\n              <h1>\n                ${club.name}\n                <span class=\"pull-right\">\n                  <button type=\"button\" class=\"btn btn-primary\" click.delegate=\"edit()\">${editing ? 'Cancel' : 'Edit'}</button>\n                </span>\n              </h1>\n            </div>\n            <div class=\"col-xs-12\">\n              <form>\n                <div class=\"form-group\">\n                  <label for=\"club.name\">Name</label>\n                  <input class=\"form-control\" value.two-way=\"club.name\" placeholder=\"Enter name here...\" if.bind=\"editing\" autofocus>\n                  <span class=\"form-control\" if.bind=\"!editing\">${club.name}</span>\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"club.color\">Color</label>\n                  <input class=\"form-control\" value.two-way=\"club.color\" placeholder=\"Enter color here...\" if.bind=\"editing\">\n                  <span class=\"form-control\" if.bind=\"!editing\">${club.color}</span>\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"club.readers.length\"># of Readers</label>\n                  <span class=\"form-control\">${club.readers.length}</span>\n                </div>\n                <button type=\"button\" class=\"btn btn-primary\" click.delegate=\"save()\" if.bind=\"editing\">Update</button>\n                <button type=\"button\" class=\"btn btn-danger\" click.delegate=\"delete()\" if.bind=\"editing\">\n                  <span>Delete </span>\n                  <i class=\"fa fa-trash\"></i>\n                </button>\n              </form>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-4 text-muted\" if.bind=\"!club.events.length\">No events</div>\n            <div class=\"col-md-4 mb\" repeat.for=\"event of club.events\">\n              <a href=\"/#club/${club.id}/events/${event.id}\">\n                <!-- WHITE PANEL - TOP USER -->\n                <div class=\"white-panel pn\">\n                  <div class=\"white-header\">\n                    <h5>${event.name}</h5>\n                  </div>\n                  <p><img src=\"assets/img/ui-danro.jpg\" class=\"img-circle\" width=\"80\"></p>\n                  <p><b></b></p>\n                  <div class=\"row\">\n                    <div class=\"col-md-6\">\n                      <p class=\"small mt\"># OF READERS</p>\n                      <p>${event.readers.length}</p>\n                    </div>\n                    <div class=\"col-md-6\">\n                      <p class=\"small mt\">END DATE</p>\n                      <p>${event.endDate}</p>\n                    </div>\n                  </div>\n                </div>\n              </a>\n            </div><!-- /col-md-4 -->\n          </div><!-- /row -->\n      </section>\n  </section>\n</template>\n"; });
define('text!views/events/index.html', ['module'], function(module) { module.exports = "<template>\n  <!-- **********************************************************************************************************************************************************\n  MAIN SIDEBAR MENU\n  *********************************************************************************************************************************************************** -->\n  <!--sidebar start-->\n  <aside>\n      <div id=\"sidebar\"  class=\"nav-collapse \">\n          <!-- sidebar menu start-->\n          <ul class=\"sidebar-menu\" id=\"nav-accordion\">\n\n              <p class=\"centered\"><a href=\"profile.html\"><img src=\"assets/img/small_logo.jpg\" class=\"img-circle\" width=\"60\"></a></p>\n              <h5 class=\"centered\">${name}</h5>\n\n              <li class=\"mt\">\n                  <a href=\"#\">\n                      <i class=\"fa fa-dashboard\"></i>\n                      <span>Dashboard</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\" repeat.for=\"c of clubs\">\n                  <a class=\"${clubId == c.id ? 'active' : ''}\" href=\"#club/${c.id}\">\n                      <i class=\"fa fa-users\"></i>\n                      <span>${c.name}</span>\n                  </a>\n              </li>\n\n              <li class=\"mt\">\n                  <a href=\"#club/create\">\n                  <span>Create a new club +</span>\n                  </a>\n              </li>\n\n          </ul>\n          <!-- sidebar menu end-->\n      </div>\n  </aside>\n  <!--sidebar end-->\n\n  <!-- **********************************************************************************************************************************************************\n  MAIN CONTENT\n  *********************************************************************************************************************************************************** -->\n  <!--main content start-->\n  <section id=\"main-content\">\n      <section class=\"wrapper\">\n          <div class=\"row\">\n            <div class=\"col-xs-12\">\n              <h1>\n                ${event.name}\n                <span class=\"pull-right\">\n                  <button type=\"button\" class=\"btn btn-primary\" click.delegate=\"edit()\">${editing ? 'Cancel' : 'Edit'}</button>\n                </span>\n              </h1>\n            </div>\n            <div class=\"col-xs-12\">\n              <form>\n                <div class=\"form-group\">\n                  <label for=\"event.name\">Name</label>\n                  <input class=\"form-control\" value.two-way=\"event.name\" placeholder=\"Enter name here...\" if.bind=\"editing\" autofocus>\n                  <span class=\"form-control\" if.bind=\"!editing\">${event.name}</span>\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"event.color\">Start</label>\n                  <input type=\"date\" class=\"form-control\" value.two-way=\"event.startDate\" placeholder=\"Enter start date here...\" if.bind=\"editing\">\n                  <span class=\"form-control\" if.bind=\"!editing\">${event.startDate}</span>\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"event.endDate\">End</label>\n                  <input type=\"date\" class=\"form-control\" value.two-way=\"event.endDate\" placeholder=\"Enter end date here...\" if.bind=\"editing\">\n                  <span class=\"form-control\" if.bind=\"!editing\">${event.endDate}</span>\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"event.readers.length\"># of Readers</label>\n                  <span class=\"form-control\">${event.readers.length}</span>\n                </div>\n                <button type=\"button\" class=\"btn btn-primary\" click.delegate=\"save()\" if.bind=\"editing\">Update</button>\n                <button type=\"button\" class=\"btn btn-danger\" click.delegate=\"delete()\" if.bind=\"editing\">\n                  <span>Delete </span>\n                  <i class=\"fa fa-trash\"></i>\n                </button>\n              </form>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-4 text-muted\" if.bind=\"!event.readers.length\">No events</div>\n            <div class=\"col-md-4 mb\" repeat.for=\"reader of event.readers\">\n              <a href=\"#events/${event.id}\">\n                <!-- WHITE PANEL - TOP USER -->\n                <div class=\"white-panel pn\">\n                  <div class=\"white-header\">\n                    <h5>${reader.firstName} ${reader.lastName}</h5>\n                  </div>\n                  <p><img src=\"assets/img/ui-zac.jpg\" class=\"img-circle\" width=\"80\"></p>\n                  <p><b></b></p>\n                  <div class=\"row\">\n                    <div class=\"col-md-6\">\n                      <p class=\"small mt\">Points</p>\n                      <p>${reader.points}</p>\n                    </div>\n                    <div class=\"col-md-6\">\n                      <p class=\"small mt\"># of Books</p>\n                      <p>${reader.books.length ? reader.books.length : 0}</p>\n                    </div>\n                  </div>\n                </div>\n              </a>\n            </div><!-- /col-md-4 -->\n          </div><!-- /row -->\n      </section>\n  </section>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map