import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Cidade } from "../models/cidade.model";
import { Observable, Subject,merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { EstadosService } from "../services/estados.service";
import { ParamPrevisao } from '../models/paramPrevisao.model';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [EstadosService]
})
export class TopoComponent implements OnInit {
     
  public estados = [] 
  public cidades = [] 
  public respostaCidade : Cidade
  public paramLoadPrevisao : ParamPrevisao
  public ok = true
  public menserro = ""
  model: any;

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  public formulario: FormGroup = new FormGroup({
    'estado': new FormControl("" ,[Validators.required]),
    'cidade': new FormControl("" ,[Validators.required]),
  })

  constructor(private estadosService : EstadosService) { }  

  ngOnInit() {

    this.paramLoadPrevisao = new ParamPrevisao( 50 , "SC" , "Blunemau")

    this.estadosService.getEstados()
     .subscribe(res => {
       this.estados = res;
     }, err => {
       console.log(err);
     });

  }

  public onSelect(event) {
    let value = event.target.value.split(";");
    this.carregaCidades(value[0])
  }

  public carregaCidades(id){ 
    this.estadosService.getCidade(id)
    .subscribe(res => {
      this.respostaCidade = res
      this.cidades = [];
      //** necessidade para que o autocomplete fosse alimentado */
      for(let obj in this.respostaCidade){
          this.cidades.push(this.respostaCidade[obj].nome)
      }
    }, err => {
      console.log(err);
    });
  }

  public buscaPrevisao(): void {
    let estado = this.formulario.value.estado
    let cidade = this.formulario.value.cidade
    if (estado == "" || estado == undefined || cidade == "" || cidade == undefined ) {
      this.menserro = "Favor informar um Estado e uma Cidade..."
      this.ok = false
      return
    }
    if(!this.cidades.includes(cidade)){
      this.menserro = "Favor selecionar uma Cidade valida..."
      this.ok = false
      return
    }
    this.ok = true
    let estad = estado.split(";")
    this.paramLoadPrevisao = new ParamPrevisao( estad[0] , estad[1] , cidade )
    this.formulario.reset({ estado: '', cidade: '' });
  }


  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.cidades
        : this.cidades.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 5))
    );
  }
}
