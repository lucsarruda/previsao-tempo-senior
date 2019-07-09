import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';

//https://api.hgbrasil.com/weather?key=712d8a61&city_name=Blumenau,SC
const apiUrl = 'https://api.hgbrasil.com/weather';
const apiKey = 'cd3d711f'

@Injectable()
export class PrevisaoService {

  constructor(private http: HttpClient) { }

  getPrevisao(estado: string, cidade:string): Observable<any> {
    const  params = new  HttpParams().set('key', apiKey ).set('city_name', `${cidade},${estado}`);
    const  headers = new HttpHeaders().set('Content-Type' , 'application/json' ).set( 'Access-Control-Allow-Origin', '*').set('Access-Control-Allow-Methods','GET')
    const url = `${apiUrl}`//=${cidade},${estado}`;
    return this.http.get<any>(url, {params,headers} ).pipe(
      tap( previsao => console.log("previsao!!! ",previsao))
    );
  }

}
