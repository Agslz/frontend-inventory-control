import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private keylcloackService: KeycloakService) {}

  getRoles() {
    return this.keylcloackService.getUserRoles();
  }

  isAdmin() {
    let roles = this.keylcloackService
      .getUserRoles()
      .filter((role) => role == 'admin');

    if (roles.length > 0) return true;
    else return false;
  }
}
