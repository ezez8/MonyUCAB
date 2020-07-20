import { Component, OnInit } from '@angular/core';
import { CuentaService } from '../servicios/cuenta/cuenta.service';
import { TarjetaService } from '../servicios/tarjeta/tarjeta.service';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../servicios/usuario/usuario.service';
import { PagoService } from '../servicios/pago/pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../servicios/login/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import {Tarjeta} from '../models/tarjeta.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  cuentas = [];
  pagos = [];
  saldo = 0;
  usuario: Usuario;
  tarjetas: Tarjeta[]= [];

  constructor(
    public _cuentaServices: CuentaService,
    public _tarjetaService: TarjetaService,
    public _usuarioService: UsuarioService,
    public _pagoServices: PagoService,
    public _activatedRoute: ActivatedRoute,
    public _logiServices: LoginService,
    public router: Router,
    public alert: AlertController
  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      //this.ngOnInit();
  });
  }

  

  ngOnInit(){
    this._usuarioService.getDatosUsuario()
    .subscribe(
    (data: any) =>
    {
      
      localStorage.setItem('idUsuario', data.result.idUsuario);
      localStorage.setItem('usuario', data.result.usuario);
      localStorage.setItem('nombreU', data.persona.nombre);
      localStorage.setItem('apellido', data.persona.apellido);
      console.log(localStorage.getItem('idUsuario'));
      console.log(localStorage.getItem('usuario'));
      console.log(localStorage.getItem('nombreU'));
      console.log(localStorage.getItem('apellido'));
      },
      err => {
        console.log(err.message);
      }
    )

    this._usuarioService.saldoActual().subscribe(
      (res: any)=>{
        this.saldo = res;
      },
      (err:any)=>{

      }
    );

  this._tarjetaService.obtenerTarjetas().subscribe(
    (res: any)=>{
      
      this.tarjetas = res;
      console.log(this.tarjetas); 
    },
    (err:any)=>{
      
    }
    );

  }



  logout() {
    this._logiServices.logout();
    this.router.navigate(['/login']);
  }

  async AlertServer() {
    const alertElement = await this.alert.create({
      header: 'Error inesperado',
      message: 'intentelo mas tarde',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
          }
        },

      ]
    });

    await alertElement.present();

  }

}
