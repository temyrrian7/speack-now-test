import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationComponent {
  @Output() deleteConfirmed = new EventEmitter<boolean>();

  private modalService = inject(ModalService);

  closeModal() {
    this.deleteConfirmed.emit(false);
    this.modalService.close();
  }

  confirmDelete() {
    this.deleteConfirmed.emit(true);
    this.closeModal();
  }
}
