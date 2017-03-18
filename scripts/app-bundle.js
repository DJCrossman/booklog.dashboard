define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Booklog';
            config.map([
                { route: '', moduleId: 'views/index', title: 'Dashboard' }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
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

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

define('views/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Home = (function () {
        function Home() {
            this.name = 'Regina Public Library';
        }
        return Home;
    }());
    exports.Home = Home;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\n\n  <section id=\"container\" >\n      <!-- **********************************************************************************************************************************************************\n      TOP BAR CONTENT & NOTIFICATIONS\n      *********************************************************************************************************************************************************** -->\n      <!--header start-->\n      <header class=\"header black-bg\">\n            <div class=\"sidebar-toggle-box\">\n                <div class=\"fa fa-bars tooltips\" data-placement=\"right\" data-original-title=\"Toggle Navigation\"></div>\n            </div>\n          <!--logo start-->\n          <a href=\"#\" class=\"logo\"><b>BOOKLOG</b></a>\n          <!--logo end-->\n          <div class=\"top-menu\">\n          \t<ul class=\"nav pull-right top-menu\">\n                  <li><a class=\"logout\" href=\"login.html\">Logout</a></li>\n          \t</ul>\n          </div>\n      </header>\n      <!--header end-->\n\n      <router-view></router-view>\n\n      <!--main content end-->\n      <!--footer start-->\n      <footer class=\"site-footer\">\n          <div class=\"text-center\">\n              © 1997-2017 Regina Public Library\n              <a href=\"#\" class=\"go-top\">\n                  <i class=\"fa fa-angle-up\"></i>\n              </a>\n          </div>\n      </footer>\n      <!--footer end-->\n  </section>\n</template>\n"; });
define('text!views/index.html', ['module'], function(module) { module.exports = "<template>\n  <!-- **********************************************************************************************************************************************************\n  MAIN SIDEBAR MENU\n  *********************************************************************************************************************************************************** -->\n  <!--sidebar start-->\n  <aside>\n      <div id=\"sidebar\"  class=\"nav-collapse \">\n          <!-- sidebar menu start-->\n          <ul class=\"sidebar-menu\" id=\"nav-accordion\">\n\n              <p class=\"centered\"><a href=\"profile.html\"><img src=\"assets/img/small_logo.jpg\" class=\"img-circle\" width=\"60\"></a></p>\n              <h5 class=\"centered\">${name}</h5>\n\n              <li class=\"mt\">\n                  <a class=\"active\" href=\"index.html\">\n                      <i class=\"fa fa-dashboard\"></i>\n                      <span>Dashboard</span>\n                  </a>\n              </li>\n\n          </ul>\n          <!-- sidebar menu end-->\n      </div>\n  </aside>\n  <!--sidebar end-->\n\n  <!-- **********************************************************************************************************************************************************\n  MAIN CONTENT\n  *********************************************************************************************************************************************************** -->\n  <!--main content start-->\n  <section id=\"main-content\">\n      <section class=\"wrapper\">\n\n          <div class=\"row\">\n              <div class=\"col-lg-9 main-chart\">\n\n              </div><!-- /col-lg-9 END SECTION MIDDLE -->\n\n\n  <!-- **********************************************************************************************************************************************************\n  RIGHT SIDEBAR CONTENT\n  *********************************************************************************************************************************************************** -->\n\n              <div class=\"col-lg-3 ds\">\n                <!--COMPLETED ACTIONS DONUTS CHART-->\n        <h3>NOTIFICATIONS</h3>\n\n                  <!-- First Action -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <span class=\"badge bg-theme\"><i class=\"fa fa-clock-o\"></i></span>\n                    </div>\n                    <div class=\"details\">\n                      <p><muted>2 Minutes Ago</muted><br/>\n                         <a href=\"#\">James Brown</a> subscribed to your newsletter.<br/>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Second Action -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <span class=\"badge bg-theme\"><i class=\"fa fa-clock-o\"></i></span>\n                    </div>\n                    <div class=\"details\">\n                      <p><muted>3 Hours Ago</muted><br/>\n                         <a href=\"#\">Diana Kennedy</a> purchased a year subscription.<br/>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Third Action -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <span class=\"badge bg-theme\"><i class=\"fa fa-clock-o\"></i></span>\n                    </div>\n                    <div class=\"details\">\n                      <p><muted>7 Hours Ago</muted><br/>\n                         <a href=\"#\">Brandon Page</a> purchased a year subscription.<br/>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Fourth Action -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <span class=\"badge bg-theme\"><i class=\"fa fa-clock-o\"></i></span>\n                    </div>\n                    <div class=\"details\">\n                      <p><muted>11 Hours Ago</muted><br/>\n                         <a href=\"#\">Mark Twain</a> commented your post.<br/>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Fifth Action -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <span class=\"badge bg-theme\"><i class=\"fa fa-clock-o\"></i></span>\n                    </div>\n                    <div class=\"details\">\n                      <p><muted>18 Hours Ago</muted><br/>\n                         <a href=\"#\">Daniel Pratt</a> purchased a wallet in your store.<br/>\n                      </p>\n                    </div>\n                  </div>\n\n                   <!-- USERS ONLINE SECTION -->\n        <h3>ACTIVE READERS</h3>\n                  <!-- First Member -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <img class=\"img-circle\" src=\"assets/img/ui-divya.jpg\" width=\"35px\" height=\"35px\" align=\"\">\n                    </div>\n                    <div class=\"details\">\n                      <p><a href=\"#\">DIVYA MANIAN</a><br/>\n                         <muted>Available</muted>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Second Member -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <img class=\"img-circle\" src=\"assets/img/ui-sherman.jpg\" width=\"35px\" height=\"35px\" align=\"\">\n                    </div>\n                    <div class=\"details\">\n                      <p><a href=\"#\">DJ SHERMAN</a><br/>\n                         <muted>I am Busy</muted>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Third Member -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <img class=\"img-circle\" src=\"assets/img/ui-danro.jpg\" width=\"35px\" height=\"35px\" align=\"\">\n                    </div>\n                    <div class=\"details\">\n                      <p><a href=\"#\">DAN ROGERS</a><br/>\n                         <muted>Available</muted>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Fourth Member -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <img class=\"img-circle\" src=\"assets/img/ui-zac.jpg\" width=\"35px\" height=\"35px\" align=\"\">\n                    </div>\n                    <div class=\"details\">\n                      <p><a href=\"#\">Zac Sniders</a><br/>\n                         <muted>Available</muted>\n                      </p>\n                    </div>\n                  </div>\n                  <!-- Fifth Member -->\n                  <div class=\"desc\">\n                    <div class=\"thumb\">\n                      <img class=\"img-circle\" src=\"assets/img/ui-sam.jpg\" width=\"35px\" height=\"35px\" align=\"\">\n                    </div>\n                    <div class=\"details\">\n                      <p><a href=\"#\">Marcel Newman</a><br/>\n                         <muted>Available</muted>\n                      </p>\n                    </div>\n                  </div>\n\n                    <!-- CALENDAR-->\n                    <div id=\"calendar\" class=\"mb\">\n                        <div class=\"panel green-panel no-margin\">\n                            <div class=\"panel-body\">\n                                <div id=\"date-popover\" class=\"popover top\" style=\"cursor: pointer; disadding: block; margin-left: 33%; margin-top: -50px; width: 175px;\">\n                                    <div class=\"arrow\"></div>\n                                    <h3 class=\"popover-title\" style=\"disadding: none;\"></h3>\n                                    <div id=\"date-popover-content\" class=\"popover-content\"></div>\n                                </div>\n                                <div id=\"my-calendar\"></div>\n                            </div>\n                        </div>\n                    </div><!-- / calendar -->\n\n              </div><!-- /col-lg-3 -->\n          </div><! --/row -->\n      </section>\n  </section>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map