import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';    

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Usuario } from '../models/usuario.model';







@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  userSubscription: Subscription;
  private _user: Usuario;
  constructor(public auth: AngularFireAuth,
                private fireStore :AngularFirestore,
                private store: Store<AppState>) { }
  
  get user(){
      return {... this._user};
  }

  crearUsuario(nombre :string,email :string, password :string){
    return this.auth.createUserWithEmailAndPassword(email,password)
            .then(({user}) => {
              const newUser = new Usuario(user.uid,nombre,email);
               
              return this.fireStore.doc(`${user.uid}/usuario`) .set({...newUser});
            });
  }
  /**
   * Inicializa la sesion
   */
  initAuthListener(){
    this.auth.authState.subscribe(fuser =>{
      if(fuser){
        this.userSubscription =this.fireStore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( (fireStoreUser :any) =>{
          //console.log({fireStoreUser});
          const user = Usuario.fromFireStore(fireStoreUser);
          this._user=user;
          //console.log({user});
          this.store.dispatch(setUser({user}));
        })
        
      }else{
        this._user=null;
        this.userSubscription?.unsubscribe();
        this.store.dispatch(unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
      
    })
  }

  loginUsuario(email :string, password :string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null) // Si el usuario esta Auth true sino false
    );
  }
}
