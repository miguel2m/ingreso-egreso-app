import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';






@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  cargando: boolean =false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store:Store<AppState>,
              private router: Router){
  
  
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    });

    this.uiSubscription=this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
  });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if(this.registroForm.invalid) return;
    this.store.dispatch(ui.isLoading());
    /*Swal.fire({
      title: 'Wait',
      onBeforeOpen: () => {
        Swal.showLoading()
       
      }
    });*/

    const {nombre,email,password} = this.registroForm.value;
    this.authService.crearUsuario(nombre,email,password)
    .then(credenciales =>{
      //Swal.close();
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    })
    .catch(err => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })
    });
  }

}
