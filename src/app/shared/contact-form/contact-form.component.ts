import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  @Input() address: string = '';
  @Input() phone: string = '';
  @Input() email: string = '';
  @Input() SatelliteMapAd: string = '';

  @Output() formSubmitted = new EventEmitter<any>();

  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  sendEmail(form: any) {
    if (form.invalid) return;
    this.formSubmitted.emit(this.formData);
    form.resetForm();
  }
  copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log(`Copied: ${text}`);
      })
      .catch((err) => {
        console.error('Copy failed', err);
      });
  }
}
