import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';
import { NgForm } from '@angular/forms';
import { PersonaService } from '../servicios/persona/persona.service';
import { Persona } from '../models/persona.model';
import { AlertController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  usuario: Usuario;
  persona: Persona;
  show = true;

  constructor(
    public _usuarioServices: UsuarioService,
    public _personaServices: PersonaService,
    public alert: AlertController
  ) {}

  ngOnInit(){
    this.usuario = this._usuarioServices.getUsuario();
    this.persona = this._personaServices.getVacio();

    this._usuarioServices.getUserInfo(this.usuario.usuario)
        .subscribe((data: any) => {
          console.log(data);
          this.persona.nombre = data.persona.nombre;
          this.persona.apellido = data.persona.apellido;
          this.persona.fecha_nacimiento = data.persona.fechaNacimiento;
          this.persona.estadoCivil = data.estadoCivil.descripcion;
        });

  }

  modificarUsuario( f: NgForm){
    this.show = false;

    var body = {
      nombre: f.value.nombre,
      apellido: f.value.apellido,
      telefono: f.value.telefono,
      direccion: f.value.direccion,
      razonSocial: '',
      idEstadoCivil: 1,
      idUsuario: this.usuario.idUsuario
    };

    this._usuarioServices.modificarUser(body)
        .subscribe((data: any) => {
          this.modificado();
        });

  }

  async AlertaError() {
    const alertElement = await this.alert.create({
      header: 'Error al modificar usuario',
      message: 'El usuario debe de ser unico ',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.show = true;
          }
        },
      ]
    });

    await alertElement.present();

  }

  async modificado() {
    const alertElement = await this.alert.create({
      header: 'Exito al modificar usuario',
      message: 'se modificaron los datos satisfactoriamente',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.show = true;
          }
        },
      ]
    });

    await alertElement.present();

  }

}
