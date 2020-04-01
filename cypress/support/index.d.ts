/// <reference types="cypress" />

type DeviceType = "small" | "medium" | "large";

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(label: string): Chainable<Element>;

    /**
     * Custom command to set the viewport to a known device type.
     * @example cy.device('small')
     */
    device(type: DeviceType): Chainable<Element>;
  }
}