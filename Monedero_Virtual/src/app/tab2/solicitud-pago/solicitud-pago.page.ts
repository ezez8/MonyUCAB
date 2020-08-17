import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pago } from '../../models/pago.model';
import { PagoService } from '../../servicios/pago/pago.service';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { CuentaService } from '../../servicios/cuenta/cuenta.service';
import { TarjetaService } from '../../servicios/tarjeta/tarjeta.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-solicitud-pago',
  templateUrl: './solicitud-pago.page.html',
  styleUrls: ['./solicitud-pago.page.scss'],
})
export class SolicitudPagoPage implements OnInit {

  operacion: Pago;
  usuario: Usuario;
  aux: number;
  receptor: string;

  auxT = false;
  auxC = false;
  auxS = false;
  show = true;
  showM = true;
  showP = true;
  showT = true;


  metodoPagoC = [];
  metodoPagoT = [];

  tarjeta: any;
  cuenta: any;

  saldo: number;
  id: number;

  hijo: number;
  restHijo = false;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _pagoServices: PagoService,
    public _usuarioServices: UsuarioService,
    public _cuentaServices: CuentaService,
    public _tarjetaServices: TarjetaService,
    public router: Router,
    public alert: AlertController,
  ) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      const recipeID = paramMap.get('pagoID');
      this.id = +recipeID;
      this.operacion = this._pagoServices.getpago(this.id);
      console.log(this.operacion);
    });

    this.usuario = this._usuarioServices.getUsuario();
    this.hijo = this._usuarioServices.getHijo();
    this._usuarioServices.getUserInfo(this.operacion.idUsuarioReceptor.toString())
        .subscribe((data:any) => {
          this.receptor = data.result.email;
        });
    this._cuentaServices.obtenerCuenta(this.usuario.idUsuario)
        .subscribe((data: any) =>  {
          this.metodoPagoC = data;
        });
    this._tarjetaServices.obtenerTarjetas(this.usuario.idUsuario)
        .subscribe((data: any) => {
          this.metodoPagoT = data;
        });

    if (this.hijo != 0 ) {
      this.restHijo = true;
      this._usuarioServices.getSaldo(this.hijo)
          .subscribe((data: any) => {
            this.saldo = data;
          });
    } else {
      this._usuarioServices.getSaldo(this.usuario.idUsuario)
      .subscribe((data:any) => {
        this.saldo = data;
      });
    }

  }

  boolTarjeta() {
    this.auxT = true;
    this.auxC = false;
    this.auxS = false;
  }

  boolCuenta() {
    this.auxC = true;
    this.auxT = false;
    this.auxS = false;
  }
  boolStripe() {
    this.auxT = false;
    this.auxC = false;
    this.auxS = true;
  }

  obtenerIDtajeta() {
  }

  obtenerIDcuenta() {
  }

  pagarTarjeta() {
    this.show = false;
    let id: number = + this.tarjeta;
    let cant: number = + this.operacion.monto;
    var body = {
      idUsuarioReceptor: this.operacion.idUsuarioReceptor,
      idMedioPaga: id,
      monto: cant,
      idOperacion: this.operacion.idPago
    };

    console.log(body);

    this._pagoServices.realizarPagoTarjeta(body)
        .subscribe((data:any) => {
          console.log(data);
          this.show = true;
          this.router.navigate(['/tabs/cuenta']);
        });

  }

  pagarCuenta() {
    this.show = false;
    let id: number = + this.cuenta;
    let cant: number = + this.operacion.monto;
    var body = {
      idUsuarioReceptor: this.operacion.idUsuarioReceptor,
      idMedioPaga: id,
      monto: cant,
      idOperacion: this.operacion.idPago
    };

    console.log(body);

    this._pagoServices.realizarPagoCuenta(body)
        .subscribe((data:any) => {
          this.show = true;
          this.router.navigate(['/tabs/cuenta']);
        });
  }

  pagarMonedero() {
    this.showM = false;

    let cant: number = + this.operacion.monto;
    if (cant > this.saldo) {
      this.AlertSaldo();
      return;
    }
    var body;
    if (this.hijo != 0 ) {
      body = {
        idUsuarioReceptor: this.operacion.idUsuarioReceptor,
        idMedioPaga: this.hijo,
        monto: cant,
        idOperacion: this.operacion.idPago
      };
    } else {
      body = {
        idUsuarioReceptor: this.operacion.idUsuarioReceptor,
        idMedioPaga: this.usuario.idUsuario,
        monto: cant,
        idOperacion: this.operacion.idPago
      };
    }

    this._pagoServices.realizarPagoMonedero(body)
        .subscribe((data:any) => {
          this.showM = true;
          this.router.navigate(['/tabs/cuenta']);
        });

  }

  getRandom() {
    return Math.random();
  }

  pagarPaypal() {

    this.showP = false;
    let x = this.getRandom() * 10000;

    var bodyl = {
      reg: true,
      idOperacion: this.id,
      payment: {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      transactions: [
        {
          amount: {
            total: this.operacion.monto,
            currency: "USD",
            details: {
              subtotal: this.operacion.monto,
              tax: "0",
              shipping: "0",
              handling_fee: "0",
              shipping_discount: "0",
              insurance: "0"
            }
          },
          description: "The payment transaction description.",
          custom: "EBAY_EMS_90048630024435",
          invoice_number: "55984746848723478" + Math.round(x),
          payment_options: {
            allowed_payment_method: "INSTANT_FUNDING_SOURCE"
          },
          soft_descriptor: "ECHI5786786",
          item_list: {
            items: [
              {
                name: "transacción",
                description: "",
                quantity: "1",
                price: this.operacion.monto,
                tax: "0",
                sku: "0",
                currency: "USD"
              }
            ],
            shipping_address: {
              recipient_name: "Brian Robinson",
              line1: "4th Floor",
              line2: "Unit #34",
              city: "San Jose",
              country_code: "US",
              postal_code: "95131",
              phone: "011862212345678",
              state: "CA"
            }
          }
        }
      ],
      note_to_payer: "Contact us for any questions on your order.",
      redirect_urls: {
        return_url: "http://localhost:8100/tabs/cuenta",
        cancel_url: "http://localhost:8100/tabs/cuenta"
      }
    }
    };

    this._pagoServices.pagoPaypal(bodyl)
        .subscribe((data: any) => {
          var body = {
            reg: true,
            idOperacion: this.id,
            idPago: data.id,
            idUsuarioPagante: "HVX2KU8G4ZUFW"
          };

          localStorage.setItem('idPaga', data.id.toString());
          localStorage.setItem('idOperacion', this.id.toString());
          localStorage.setItem('aprovar', 'true');

          window.location.href = data.links[1].href;
          this.showP = true;

        });


  }

  pagarStripe() {
    this.showT = false;
    let cant: number = + this.operacion.monto;

    var body = {
      monto: cant,
      descripcion: "Prueba Exitosa",
      emailReceptor: this.receptor,
      reg: true,
      idOperacion: this.id
    };

    console.log(body);

    this._pagoServices.pagoStripe(body)
        .subscribe((data: any) => {
          this.router.navigate(['/tabs/cuenta']);
          this.showT = true;
        });

  }

  async AlertSaldo() {
    const alertElement = await this.alert.create({
      header: 'Saldo insuficiente',
      message: '',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.showM = true;
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


}
