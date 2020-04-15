import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  cargando: boolean =false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store:Store<AppState>,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
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

  loginUsuario(){
    if(this.loginForm.invalid) return;

    this.store.dispatch(ui.isLoading());

    /*Swal.fire({
      title: 'Wait',
      onBeforeOpen: () => {
        Swal.showLoading()
       
      }
    });*/


    const {email,password} = this.loginForm.value;
    this.authService.loginUsuario(email,password)
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
