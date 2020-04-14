import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit {
  ingresoEgresoForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    /*this.ingresoEgresoForm = this.fb.group({
      nombre:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    });*/
  }

}
