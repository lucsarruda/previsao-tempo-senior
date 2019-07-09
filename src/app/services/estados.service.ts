import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Estado } from "../models/estado.model";
import { Cidade } from "../models/cidade.model";

const apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
//https://servicodados.ibge.gov.br/api/v1/localidades/estados/42/municipios

@Injectable()
export class EstadosService {

  constructor(private http: HttpClient) { }

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(apiUrl)
      .pipe(
        tap(estados => estados )
      )
  }

  getCidade(id: number): Observable<Cidade> {
    const url = `${apiUrl}/${id}/municipios`;
    return this.http.get<Cidade>(url).pipe(
      tap( cidades => cidades)
    );
  }

}
