import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Usuario } from '../../models/usuario.model';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  userSubs :Subscription;

  nombre:string;
  email:string;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store <AppState>) {

  }

  ngOnInit(): void {
    this.userSubs=this.store.select('user')
      .pipe(
        filter(auth => auth.user != null   )
      )
      .subscribe(
        ({user }) =>{ 
          
           this.nombre =user.nombre;
           this.email=user.email;
        }
      );
  }

  ngOnDestroy(){
    this.userSubs.unsubscribe();
  }
  
  logout(){
    Swal.fire({
      title: 'Wait',
      onBeforeOpen: () => {
        Swal.showLoading()
       
      }
    });
    this.authService.logout()
    .then(()=>{
      Swal.close();
      this.router.navigate(['/login']);
    } );
  }
}
