import { Component } from '@angular/core';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
 faArrowUp = faArrowUp;

 isOpen = false;

 toggleDropdown() {
   this.isOpen = !this.isOpen;
 }
}
