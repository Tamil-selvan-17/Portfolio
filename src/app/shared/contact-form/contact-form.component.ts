import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() address: string = '';
  @Input() phone: string = '';
  @Input() email: string = '';
  @Input() SatelliteMapAd: string = '';
  @Output() formSubmitted = new EventEmitter<any>();

  sampleemail: string = 'name@example.com';
  copiedField: 'email' | 'phone' | null = null;

  contactForm!: FormGroup;
  safeMapUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder) {}

  ngOnInit(): void {
    const strictEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.pattern(strictEmailPattern)],
      ],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnChanges(): void {
    if (this.SatelliteMapAd) {
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.SatelliteMapAd
      );
    }
  }

  sendEmail(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formData = this.contactForm.value;
    this.formSubmitted.emit(formData);
    alert(
      `✅ Thank you, ${formData.name}!\n\nYour message has been sent successfully:\n\n"${formData.message}"`
    );

    this.contactForm.reset();
  }

  copyToClipboard(text: string, field: 'email' | 'phone') {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.copiedField = field;
        setTimeout(() => {
          this.copiedField = null;
        }, 1500); // Hide after 1.5 seconds
      })
      .catch((err) => {
        console.error('Copy failed', err);
      });
  }

  get f() {
    return this.contactForm.controls;
  }
}
