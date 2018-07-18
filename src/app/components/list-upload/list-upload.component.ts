import { Component, OnInit, OnDestroy, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { FileUpload } from '../../models/fileupload';
import { UploadFileService } from '../../services/upload-file.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import  { Subscription } from "rxjs/Rx";
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-list-upload',
  templateUrl: './list-upload.component.html',
  styleUrls: ['./list-upload.component.css']
})
export class ListUploadComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileVideoInput') fileVideoInput: ElementRef;

  public fileUploads: any[];
  private currentFileUpload: FileUpload;
  public showLoader: Boolean = false;
  public progress: { percentage: number } = { percentage: 0 };
  public URL = window.URL || (window as any).webkitURL;

  private selectedFiles: FileList;
  private galleryImgUrl: String;
  private galleryVideoUrl: String;
  private imageTriggerClick: Boolean = false;
  private uploadServiceSub: Subscription;
  private inputClickSub: Subscription;
  private videoInputClickSub: Subscription;


  constructor(public uploadService: UploadFileService, private router: Router,
    private dataService: DataService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadImagesFromServer();
  }

  private loadImagesFromServer() {
    let localFilesArr;

    if (navigator.onLine) {
      // Use snapshotChanges().map() to store the key
      this.uploadServiceSub = this.uploadService.getFileUploads(50).snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })).subscribe(fileUploads => {
        const filesArr = fileUploads.map((file) => {
          file['isSynched'] = true;
          return file;
        });
        localFilesArr = this.dataService.getOfflineImages();
        const totalFiles = (localFilesArr) ? localFilesArr.concat(filesArr.reverse()) : filesArr.reverse();
        this.dataService.setListImages(totalFiles);
        this.fileUploads = this.dataService.getListImages();
      });
    } else {
      localFilesArr = this.dataService.getOfflineImages();
      this.dataService.setListImages(localFilesArr);
      this.fileUploads = this.dataService.getListImages();
    }
  }

  public getSanitizedURL(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // sync images from server
  public syncImage(obj) {
    this.uploadService.showLoader();
    this.currentFileUpload = new FileUpload(this.dataService.getFileForIndex(obj.fileIndex));
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.progress);
    const filesArr = this.dataService.getListImages();
    let fileIndex;
    filesArr.forEach((element, objIndex) => {
      if (element.fileIndex === obj.fileIndex) {
        fileIndex = objIndex;
      }
    });

    filesArr.splice(fileIndex, 1);
    this.dataService.setListImages(filesArr);

    // get and set cached images list
    const offlineFilesArr = this.dataService.getOfflineImages();
    offlineFilesArr.forEach((element, objIndex) => {
      if (element.fileIndex === obj.fileIndex) {
        fileIndex = objIndex;
      }
    });
    offlineFilesArr.splice(fileIndex, 1);
    this.dataService.setOfflineImages(offlineFilesArr);
  }

  ngAfterContentInit() {
    const self = this;
    this.inputClickSub = this.dataService.inputClick.subscribe(data => {
      if (self.dataService.imageTriggerClicked) {
        self.triggerClick();
      }
    });

    this.videoInputClickSub = this.dataService.videInputClick.subscribe(data => {
      if (self.dataService.videoTriggerClicked) {
        self.triggerVideoClick();
      }
    });
  }

  public triggerClick() {
    this.fileInput.nativeElement.click();
    this.dataService.setImageTriggerClick(false);
  }

  public triggerVideoClick() {
    this.fileVideoInput.nativeElement.click();
    this.dataService.setVideoTriggerClick(false);
  }

  // select image file for upload
  public selectFile(event) {
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (innerEvent: any) => {
        this.galleryImgUrl = innerEvent.target.result;
        this.upload('image');
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // select video fiel for upload
  public selectVideoFile(event) {
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      this.galleryVideoUrl = URL.createObjectURL(event.target.files[0]);
      this.upload('video');
    }
  }

  // upload selected image/video
  private upload(type) {
    const file = this.selectedFiles.item(0);
    let filesArr = this.dataService.getOfflineImages();
    this.dataService.setCurrentFile(file);

    let fileUrl;
    if (type === 'image') {
      fileUrl = this.galleryImgUrl;
    } else {
      fileUrl = this.galleryVideoUrl;
    }

    const currFile = {
      isSynched: false,
      url: fileUrl,
      fileIndex: this.dataService.getCurrentfileIndex(),
      fileData: file,
      type: type
    };

    if (filesArr && filesArr.length) {
      filesArr.push(currFile);
    } else {
      filesArr = [currFile];
    }
    this.dataService.setOfflineImages(filesArr);
    this.loadImagesFromServer();
  }

  // function for delete image locally
  public deleteImg(obj) {
    const filesArr = this.dataService.getListImages();
    let fileIndex;
    filesArr.forEach((element, objIndex) => {
      if (element.fileIndex === obj.fileIndex) {
        fileIndex = objIndex;
      }
    });

    filesArr.splice(fileIndex, 1);
    this.dataService.setListImages(filesArr);

    const offlineFilesArr = this.dataService.getOfflineImages();
    offlineFilesArr.forEach((element, objIndex) => {
      if (element.fileIndex === obj.fileIndex) {
        fileIndex = objIndex;
      }
    });
    offlineFilesArr.splice(fileIndex, 1);
    this.dataService.setOfflineImages(offlineFilesArr);
    this.loadImagesFromServer();
  }

  // delete images on server
  public deleteOnlineImg(obj) {
    const filesArr = this.dataService.getListImages();
    let fileIndex;
    filesArr.forEach((element, objIndex) => {
      if (element.url === obj.url) {
        fileIndex = objIndex;
      }
    });

    filesArr.splice(fileIndex, 1);
    this.dataService.setListImages(filesArr);
  }

  ngOnDestroy() {
    this.uploadServiceSub.unsubscribe();
    this.inputClickSub.unsubscribe();
    this.videoInputClickSub.unsubscribe();
  }

}
