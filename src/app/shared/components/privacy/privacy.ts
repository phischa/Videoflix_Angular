import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Privacy Policy Page
 * 
 * Statische Seite mit Datenschutzerklärung
 * Entspricht: privacy/index.html aus Vanilla-Projekt
 */
@Component({
    selector: 'app-privacy',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './privacy.html',
    styleUrl: './privacy.scss'
})
export class PrivacyComponent {
    // Statische Component - keine Logic benötigt
}