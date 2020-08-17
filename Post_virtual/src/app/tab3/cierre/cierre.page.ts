import { Component, OnInit } from '@angular/core';
import { PagoService } from '../../servicios/pago/pago.service';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { OperacionService } from '../../servicios/operacion/operacion.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cierre',
  templateUrl: './cierre.page.html',
  styleUrls: ['./cierre.page.scss'],
})
export class CierrePage implements OnInit {

  pagos = [];
  usuario: Usuario;

  idOperacion = "";
  monto = "";
  day = "";
  month = "";
  year = "";
  referencia = "";

  constructor(
    public _usuarioService: UsuarioService,
    public _pagoServices: PagoService,
    public _operacionServices: OperacionService,
    public alert: AlertController
  ) { }

  setCierre(){
    this.idOperacion = localStorage.getItem('idOperacionMonedero');
    this.monto = localStorage.getItem('monto');
    this.day = localStorage.getItem('day');
    this.month = localStorage.getItem('month');
    this.year = localStorage.getItem('year');
    this.referencia = localStorage.getItem('referencia');
  }

  ngOnInit() {

 this.setCierre();
  }
    
  ionViewWillEnter(){
    this.setCierre();
  }

}
