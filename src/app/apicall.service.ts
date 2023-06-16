import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

  constructor(
    private http: HttpClient
  ) { }


  requestOptions : Object = {
    // headers : new HttpHeaders().append('Content-Type','text/xml'),
    headers : new HttpHeaders().append('Content-Type','application/json'),
    responseType: 'text'
  }

  requestOptionsWithToken : Object = {
    headers : new HttpHeaders().append('Content-Type','text/xml')
    .append("Authorization", "Bearer " + sessionStorage.getItem("Token") + ":"+ sessionStorage.getItem("VIID")),
    responseType: 'text'
  }

  getLatestAction(){
    return this.http.get("localhost:3000/api/latestaction", this.requestOptions)
    .pipe(
      map((response: any) => {
        return response;

      }),
      catchError((err) => {
        console.warn('INT ERR:', err);
        return err;
      })
    );
  }


  postActions(name : string, value : string){
    if(name == "" && value == "")
      return

    let body = {
      "Action" : {
        "name" : name,
        "value" : value
      }
    }
    
    return this.http.post("http://localhost:3000/api/actions",body,this.requestOptions)
    .pipe(
      map((response: any) => {
        return response;

      }),
      catchError((err) => {
        console.warn('INT ERR:', err);
        return err;
      })
    );
  }


  getActions(){
    let body = {}
    
    return this.http.post("http://localhost:3000/api/latestaction",body,this.requestOptions)
    .pipe(
      map((response: any) => {
        return response;

      }),
      catchError((err) => {
        console.warn('INT ERR:', err);
        return err;
      })
    );
  }

}
