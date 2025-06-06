/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION, provideNativeDateAdapter} from '@angular/material/core';
import {TreeFlatChildAccessorOverviewExample} from './example/tree-flat-child-accessor-overview-example';

console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);

bootstrapApplication(TreeFlatChildAccessorOverviewExample, {
  providers: [provideAnimations(), provideHttpClient(), provideNativeDateAdapter()],
}).catch(err => console.error(err));
