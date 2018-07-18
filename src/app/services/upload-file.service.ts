import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

import { FileUpload } from '../models/fileupload';

@Injectable()
export class UploadFileService {

  private basePath = '/uploads';
  private storageRefUrl: String;
  public showLoaderImg: Boolean = false;

  constructor(private db: AngularFireDatabase) { }

  showLoader() {
    this.showLoaderImg = true;
  }

  public pushFileToStorage(fileUpload: FileUpload, progress: { percentage: number }) {
    const storageRef = firebase.storage().ref();
    const imageNameArr = fileUpload.file.name.split('.');
    const imgSuffix = new Date().getTime();
    const imageNameNew = `${imageNameArr[0]}_${imgSuffix}.${imageNameArr[imageNameArr.length - 1]}`;
    const uploadTask = storageRef.child(`${this.basePath}/${imageNameNew}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.name = fileUpload.file.name;

        let fileType = 'image';
        if (fileUpload.file.type.indexOf('video') > -1) {
          fileType = 'video';
        }

        fileUpload['type'] = fileType;

        const self = this;
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          fileUpload.url = downloadURL;
          self.saveFileData(fileUpload);
        });
        return true;
      }
    );
  }

  private saveFileData(fileUpload: FileUpload) {
    this.db.list(`${this.basePath}/`).push(fileUpload);
    this.showLoaderImg = false;
  }

  // get limited uploaded files
  public getFileUploads(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }

  // delete uploaded file
  public deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  // delete fiel from cached db
  private deleteFileDatabase(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  // delete file from firebase storage
  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }
}
