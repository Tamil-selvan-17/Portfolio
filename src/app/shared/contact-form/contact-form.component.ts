import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent implements OnChanges {
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

  safeMapUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    if (this.SatelliteMapAd) {
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.SatelliteMapAd
      );
    }
  }

  sendEmail(form: any) {
    if (form.invalid) return;
    this.formSubmitted.emit(this.formData);
    form.resetForm();
  }

  copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log(`Copied: ${text}`))
      .catch((err) => console.error('Copy failed', err));
  }
}
