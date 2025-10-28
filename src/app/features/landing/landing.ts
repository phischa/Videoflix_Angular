import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {
  email: string = '';

  constructor(private router: Router) { }

  onSignUp(event?: Event) {
    if (event) {
      event.preventDefault();  // ← Stop native submit!
    }

    if (this.email) {
      this.router.navigate(['/register'], {
        queryParams: { email: this.email }
      });
    }
  }
}