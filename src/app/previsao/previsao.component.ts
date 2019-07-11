import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PrevisaoService } from '../services/previsao.service';

@Component({
  selector: 'app-previsao',
  templateUrl: './previsao.component.html',
  styleUrls: ['./previsao.component.css'],
  providers: [PrevisaoService]
})
export class PrevisaoComponent implements OnInit,OnChanges {

  @Input() recebeTopo;

  public previsao : any

  constructor( private previsaoService : PrevisaoService ) { }

  ngOnInit() {
  }

  ngOnChanges(){
    let estado = this.recebeTopo.estado
    let cidade = this.recebeTopo.cidade
    this.previsaoService.getPrevisao(estado,cidade)
    .subscribe(res => {
      this.previsao = res.results 
    }, err => {
      console.log(err);
    });
  }

}
