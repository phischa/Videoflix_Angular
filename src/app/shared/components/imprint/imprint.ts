import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Imprint Page
 * 
 * Statische Seite mit Impressum
 * Entspricht: imprint/index.html aus Vanilla-Projekt
 */
@Component({
    selector: 'app-imprint',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './imprint.html',
    styleUrl: './imprint.scss'
})
export class ImprintComponent {
    // Statische Component - keine Logic benötigt
}