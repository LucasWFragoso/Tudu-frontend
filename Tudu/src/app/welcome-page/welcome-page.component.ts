import { Component } from '@angular/core';
import {faArrowUp, faMinus} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {

  faArrowUp = faArrowUp;
  isOpen: boolean = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.faArrowUp = faMinus;
    } else {
      this.faArrowUp = faArrowUp;
    }
  }
}
