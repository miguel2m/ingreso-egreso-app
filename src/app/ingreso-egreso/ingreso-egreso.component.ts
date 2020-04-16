import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';






@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit , OnDestroy{
  ingresoEgresoForm: FormGroup;
  tipo :string = 'ingreso';
  
  cargando: boolean =false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store:Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoEgresoForm = this.fb.group({
      descripcion:['',Validators.required],
      monto:['',[Validators.required]]
    });

    this.uiSubscription=this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
  });
  }
  
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  guardar(){
      if(this.ingresoEgresoForm.invalid) return;

      this.store.dispatch(ui.isLoading());

      const {descripcion,monto} = this.ingresoEgresoForm.value;
      const ingresoEgreso = new IngresoEgreso(descripcion,monto,this.tipo);
      this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
          .then(ref => {
            this.store.dispatch(ui.stopLoading());
            Swal.fire('Registro Creado', descripcion,'success')
          })
          .catch(err => {
            this.store.dispatch(ui.stopLoading());
            Swal.fire('Error', err.message ,'error')  
          });
  }

}
