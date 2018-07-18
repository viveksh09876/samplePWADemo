export class FileUpload {

  key: string;
  name: string;
  url: string;
  file: File;
  isSynched: Boolean;
  type: string;

  constructor(file: File) {
    this.file = file;
  }
}
