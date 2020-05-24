import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }
  setHttpRequestToDownloadFile(uniqueNameForReference,linkToView,typeOfFile){
    console.log(typeOfFile);
    this.http.get(linkToView,{responseType: 'blob' })
   .subscribe(data => {
    const blob = new Blob([data], { type: typeOfFile })
    saveAs(blob,uniqueNameForReference);

  });

  }
}
