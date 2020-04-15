import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';    

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Usuario } from '../models/usuario.model';






@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
                private fireStore :AngularFirestore,
                private store: Store<AppState>) { }

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
        this.fireStore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( (fireStoreUser :any) =>{
          //console.log({fireStoreUser});
          const user = Usuario.fromFireStore(fireStoreUser);
          //console.log({user});
          this.store.dispatch(setUser({user}));
        })
        
      }else{
        this.store.dispatch(unSetUser());
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
