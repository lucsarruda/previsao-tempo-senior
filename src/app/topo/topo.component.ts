import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Cidade } from "../models/cidade.model";
import { Observable, Subject,merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { EstadosService } from "../services/estados.service";

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [EstadosService]
})
export class TopoComponent implements OnInit {
     
  public estados = [] 
  public respostaCidade : Cidade
  public cidades = [] 
  public paramLoadPrevisao = []

  model: any;

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  public formulario: FormGroup = new FormGroup({
    'estado': new FormControl(null),
    'cidade': new FormControl(null),
  })

  constructor(private estadosService : EstadosService) { }  

  ngOnInit() {

    this.paramLoadPrevisao = [42,"SC","Blumenau"]

     this.estadosService.getEstados()
     .subscribe(res => {
       this.estados = res;
     }, err => {
       console.log(err);
     });

  }

  public changeEstado(event){
    console.log(event.target)
    console.log(event.target.value)
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
    let estad = this.formulario.value.estado.split(";")
    this.paramLoadPrevisao = [estad[0],estad[1],this.formulario.value.cidade]
    this.formulario.reset();
  }


  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.cidades
        : this.cidades.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
}
