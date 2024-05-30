import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    Swal.fire({
      title,
      text,
      icon,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  showConfirmation(title: string, text: string): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  // Método para mostrar una alerta personalizada con variables locales
  showCustomAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    Swal.fire({
      title,
      text,
      icon,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}
