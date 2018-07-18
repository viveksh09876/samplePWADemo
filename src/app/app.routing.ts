import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListUploadComponent } from './components/list-upload/list-upload.component';
import { AboutComponent } from './components/about/about.component';
import { FeaturesComponent } from './components/features/features.component';


export const routes: Routes = [
  {
    path: '',
    component: ListUploadComponent,
    pathMatch: 'full'
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'features',
    component: FeaturesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
