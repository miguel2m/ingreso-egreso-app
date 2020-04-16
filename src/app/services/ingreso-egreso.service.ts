import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';   

import { map } from 'rxjs/operators';

import { IngresoEgreso } from '../models/ingreso-egreso.model';

import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private fireStore :AngularFirestore,
                private authService: AuthService) { }

   crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const uid = this.authService.user.uid; //UID del usuario
    delete ingresoEgreso.uid; //Borrar la propiedad UID ingresoEgreso vacio
     return this.fireStore.doc(`${uid}/ingresos-egresos`)
        .collection('items')
        .add({...ingresoEgreso});
  }

  initIngresoEgresoListener(uid: string){
   return this.fireStore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot =>{
          return snapshot.map(doc =>{
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            }
          })
        })
      );
  }

  borrarIngresoEgreso(uidItem :string){
    const uid = this.authService.user.uid; //UID del usuario
    return this.fireStore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }
}
