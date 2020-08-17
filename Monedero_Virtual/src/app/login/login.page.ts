import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario/usuario.service';
import { LoginService } from '../servicios/login/login.service';
import { Usuario } from '../models/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  aux = false;
  show = true;

  constructor(public router: Router,
              public _usuarioServices: UsuarioService,
              public _loginServices: LoginService,
              public alert: AlertController,
    ) { }

ngOnInit() {
}

ingresar( f: NgForm ) {
  
  localStorage.setItem('aprovar', 'false');
  localStorage.setItem('recarga', 'false');

  this.show = false;

  let userM: string = f.value.user.toUpperCase();
  var body = {
    UserName: '',
    Email: f.value.user,
    Password: f.value.password,
    comercio: this.aux
  };

  this._loginServices.ingresar(body)
      .subscribe((data: any) => {
        localStorage.setItem('token', data.result.token);
        localStorage.setItem('user', data.result.username);
        localStorage.setItem('guard', 'true');
        this._usuarioServices.getUserInfo(data.result.username)
            .subscribe((data: any) => {
              this.aux = false;
              this._loginServices.login();
              let usuario = new Usuario(data.result.idUsuario, data.result.idTipoUsuario, data.tipoIdentificacion.idTipoIdentificacion,
                  data.result.usuario, data.result.fechaRegistro, data.result.nroIdentificacion, data.result.email, data.result.telefono,
                  data.result.direccion, data.result.estatus);
              this._usuarioServices.guardarUsuario(usuario);
              this.show = true;
              this.router.navigate(['/tabs/cuenta']);
            });
      },
      error => {
        if (error.status === 400) {
          this.show = true;
          this.AlertaError();
        }
      });

}

async AlertaError() {
  const alertElement = await this.alert.create({
    header: 'Error en login',
    message: 'Usuario y/o clave incorrectas ',
    buttons: [
      {
        text: 'Aceptar',
        handler: () => {
          this.router.navigate(['/login']);
          }
        },

      ]
    });

    await alertElement.present();

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

  cambiar() {
    this.aux = true;
  }

  recuperar(correo: string) {
    var body = {
      email: correo
    };
    this._usuarioServices.recuperarContrasena(body)
        .subscribe((data:any) => {
          this.correo();
        });
  }

  async correo() {
    const alertElement = await this.alert.create({
      header: 'Correo enviado',
      message: 'revisar la la informacion del correo',
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
