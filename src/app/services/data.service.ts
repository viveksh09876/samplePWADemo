import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private currImage: Array<any> = [];
  private offlineImages: Array<any> = [];
  public imageTriggerClicked: Boolean = false;
  public videoTriggerClicked: Boolean = false;
  private listImages: Array<any> = [];
  private counter: number = 0;
  private inputClickTrigger = new BehaviorSubject<number>(0);
  private videoInputClickTrigger = new BehaviorSubject<number>(0);

  public  inputClick = this.inputClickTrigger.asObservable();
  public  videInputClick = this.videoInputClickTrigger.asObservable();

  public setCurrentFile(currImage) {
    this.currImage['image' + this.counter] = currImage;
    this.counter++;
  }

  // update image list with new captured image
  public updatedInputTrigger(data) {
    this.imageTriggerClicked = true;
    this.inputClickTrigger.next(data);
  }

  // update video list with new captured video
  public updatedVideoInputTrigger(data) {
    this.videoTriggerClicked = true;
    this.videoInputClickTrigger.next(data);
  }

  // fun for triggering camera for image
  public setImageTriggerClick(imageTriggerClicked) {
    this.imageTriggerClicked = imageTriggerClicked;
  }

  // fun for triggering camera for video
  public setVideoTriggerClick(videoTriggerClicked) {
    this.videoTriggerClicked = videoTriggerClicked;
  }

  // return image list
  public getListImages() {
    return this.listImages;
  }

  // update image list
  public setListImages(listImages) {
    this.listImages = listImages;
  }

  // get cached image list
  public getOfflineImages() {
    return this.offlineImages;
  }

  // set cached image list
  public setOfflineImages(offlineImages) {
    this.offlineImages = offlineImages;
  }

  // get selected file index
  public getCurrentfileIndex() {
    return this.counter - 1;
  }

  // get file for selected index
  public getFileForIndex(fileIndex) {
    return this.currImage['image' + fileIndex];
  }

  // upload selected file
  public upload(data): Observable<any> {
    return;
  }
}
