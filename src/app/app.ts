import { Component, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Controla si el menu movil esta abierto o cerrado. */
  protected isMobileMenuOpen = false;

  /** Alterna el estado del menu hamburguesa en dispositivos moviles. */
  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /** Cierra el menu movil tras navegar o cuando ya no es necesario mostrarlo. */
  protected closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  /** Cierra el panel movil al pasar a viewport de escritorio para evitar estados inconsistentes. */
  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (window.innerWidth > 991.98) {
      this.closeMobileMenu();
    }
  }
}
