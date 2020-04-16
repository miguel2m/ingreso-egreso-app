import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [
  ]
})
export class FooterComponent implements OnInit {
  fecha:number;
  constructor() { }

  ngOnInit(): void {
    this.fecha = new Date().getFullYear();
  }

}
