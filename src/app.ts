import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router){
    config.title = 'Booklog';
    config.map([
      { route: 'club/:id/events/:eid',  moduleId: 'views/events/index',    title: 'Event Details'},
      { route: 'club/create',  moduleId: 'views/club/create',    title: 'Create Club'},
      { route: 'club/:id',  moduleId: 'views/club/index',    title: 'Club Details'},
      { route: '',  moduleId: 'views/index',    title: 'Dashboard'}
    ]);

    this.router = router;
  }
}
