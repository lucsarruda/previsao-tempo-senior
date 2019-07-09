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

  constructor( private previsaoService : PrevisaoService ) { }

  ngOnInit() {
  }

  ngOnChanges(){
    let estado = this.recebeTopo[1]
    let cidade = this.recebeTopo[2]
    this.previsaoService.getPrevisao(estado,cidade)
    .subscribe(res => {
       console.log(res)
    }, err => {
      console.log(err);
    });
  }

}
