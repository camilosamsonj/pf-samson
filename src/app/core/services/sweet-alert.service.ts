import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    swal.fire({
      title,
      text,
      icon,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  showConfirmation(title: string, text: string): Promise<boolean> {
    return swal.fire({
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
    swal.fire({
      title,
      text,
      icon,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }


  showCustomToast(title: string, icon: 'info' | 'success'): void {
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.onmouseenter = swal.stopTimer;
        toast.onmouseleave = swal.resumeTimer;
      },
    });
    Toast.fire({
      icon,
      title,
    })
  }












}
