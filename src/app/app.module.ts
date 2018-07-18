import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app.routing';
import { WebcamModule } from 'ngx-webcam';
import { DataService } from './services/data.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ListUploadComponent } from './components/list-upload/list-upload.component';

import { UploadFileService } from './services/upload-file.service';
import { AboutComponent } from './components/about/about.component';
import { FeaturesComponent } from './components/features/features.component';


@NgModule({
  declarations: [
    AppComponent,
    ListUploadComponent,
    AboutComponent,
    FeaturesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebcamModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [DataService, UploadFileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
