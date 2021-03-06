// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy.js";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import { getTestBed } from "@angular/core/testing";
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

// No typing for the `__karma__` variable.
declare const __karma__: any;
declare const require: any;

// tslint:disable-next-line:only-arrow-functions
__karma__.loaded = function () {
	/*stub*/
};

getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);
const context = require.context("./", true, /\.spec\.ts$/);
context.keys().map(context);
__karma__.start();
