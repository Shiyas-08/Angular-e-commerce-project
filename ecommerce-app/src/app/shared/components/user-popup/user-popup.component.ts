import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent {

  @Input() user: any;

  @Output() closePopup = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();

  get avatarLetter() {
    return this.user?.name ? this.user.name.charAt(0).toUpperCase() : '?';
  }

  close() {
    this.closePopup.emit();
  }

  logout() {
    this.logoutEvent.emit();
  }
}
