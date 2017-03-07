SIHM angularjs seed
================================

How To
-------------

### Start a new project from this seed

To start a new project from this seed, follow the following steps :

1. cd to the <appFodler> folder and run ``npm install``

2. change the project's data in the package.json file

3. change the app title in app/index.html and the app name in app/app.component.js > @Module > name.

4. remove all the README content

### Start browserSync server

1. `npm start`
2. Browse to `http://localhost:9000`

### Test

#### Unit Tests

run `npm test` to launch unit tests

### Lint

run `npm run lint` to run eslint

### Distribute

run `npm run release` bundle, cache busting, and minify

### change the npm tasks configuration

#### use environment option

You can use the --env option to set the environment to 'development', 'production', 'local' or 'implementation' for any npm task.

For example, if you want to distribute the projet on production, run :
```
npm run release -- --env production
```

The development environment is used by default (even for the release task !).

The local environment is set thanks to the local-config.js file that you can create by copying the local-config.template.js

See gulp/config.js for more informations (default parameters, etc ...).

Engines
-------------

This project is strongly bound to :
* gulp
* system.js and jspm
* angularjs 1.5
* babel.js
* angular material (at a lower level)

The following engines may be required in the OS for some uses :
* istanbul
* remap-istanbul
* git

### Versions
The project has been tested with the following environment:

- node v4.4.7
- npm v2.15.8
- jspm v0.16.42

Conventions and requirements
----------------

### Sources tree
By convention only 2 levels can be used for modules, eg : app/src/module/level1/level2.
Gulp tasks don't work if a third level is added.

### Modules

When a module can be lazy loaded, you need :
 * to export the module definition object (ex: AdminModule) at first
 * to export the "angular.module" return has the "module"
variable
 * to define a "main component" for this module thanks to the "component" property of the definition object (ex: AdminModule.component)

We recommend to always follow this rules, even if your module doesn't need to be lazy loaded.

### Components

When defining a new component, you should :
1. define and export the component's controller has an ES6 class
2. add a `$$name` string property to this class, which you later use as the first parameter for the `angularModule.component` function,
   when registering the component in the module file
3. also add a `$$config` object property to this class, which will represent the component definition object (ie. the
second argument for the previously mentioned angular function)

### Routes

Accordingly, in order to define new routes, you'll need to :
0. import { generateRoutesConfigurations } from 'common/utils/routes';
1. define (and export) a `ROUTES` array in the module definition file, which will be an array of "route definition objects"
2. call the `generateRoutesConfiguration` with the previously definied array
3. use each methods into the returned object has argument to a `angularModule.config` function call

### runtime configuration

All the runtime configuration should be done thanks to json files.

The 'source' json files (into the app/config folder) permit to generate 'real' configuration files (into target/), and should be created as follows (example for generating a my-config.json file) :
1. create a 'my-config.common.json' file, which will include **all** configuration keys, with a default value
2. create a 'my-config.export.json' file, which will specify a "%KEYWORD%" value for any key you want to permit to configure **after** a release.
This file will be used to generate a 'my-config.tpl.json' file, which could be used as a "template" to replace (thanks to bash) the generated my-config.json file.
3. create any 'my-config.*environment*.json' file, with the specific values for any key you want to change in the corresponding environment.
The corresponding keys will overwrite the values from the 'common.json' file when you'll use, for example, ``npm run release -- --env production`` or ``npm start -- --env development``
4. import the **resulting** (generated) file into your code :
``import * as my_config from 'config/my-config.json!'``

This files aren't included in any bundle, nore minified, and will be downloaded separatly. **Keep them lite !**

### commons

Due to some restrinctions, "commons" (ie. es6 modules used in several lazy loaded angularjs modules) are **NOT** automatically detected as such.
In other worlds, **'common/\*' items will not be included in any bundle except main.js'** !

Therefore, you need to import every of this es6 module in the main angularjs module, even if it's not used in it.
We recommend to do so at the top of the app.component.js file (under the corresponding comment).

Last but not least : **all file from the app/common folder should be loaded as part of the 'common/\*' systemjs path**, not 'app/common/\*', as for the 'app/config' folder.

For exemple, if you need the app/common/test.service.js file in app/src/admin/builder.component.js (which is lazy loaded as part of the admin angularjs module),
the "common/* imports" part of your app.component.js file should look like this :

```javascript
// each common/* file that is used by this project needs to be imported here
// even the ones that are used only in lazy loaded modules
import 'common/REST_PATHS';
import 'common/WORDING';
import 'common/test.service;
```

Of course, in that case, you also need to import this service into app/src/admin/admin.module.js file and register it :

```javascript
import { TestService } from 'common/test.service';

export let module = angular.module(AdminModule.name, AdminModule.dependencies)
    .service(TestService.$$id, TestService)
```

Credits
-----------

SIHM-AngularJS-Seed has been forked from [SDN-AngularJS-Seed](https://github.com/Sedona-Solutions/sdn-angularjs-seed),
which is created and maintained by [Sedona](http://www.sedona.fr), and available on Github under a free and open
source (MIT) license .
