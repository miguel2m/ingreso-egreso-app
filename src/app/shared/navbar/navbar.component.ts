import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  userSubs :Subscription;

  nombre:string;
  email:string;

  constructor(private store: Store <AppState>) { }

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

}
