import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router){
    config.title = 'Booklog';
    config.map([
      { route: '',  moduleId: 'views/index',    title: 'Dashboard'}
    ]);

    this.router = router;
  }
}
