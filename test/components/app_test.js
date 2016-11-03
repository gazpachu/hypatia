/* eslint-disable no-undef, no-unused-expressions */
import { renderComponent, expect } from '../test_helper';
import App from '../../src/app/components/App';

describe('App', () => {
  let component;

  beforeEach(() => {
    component = renderComponent(App);
  });

  it('renders something', () => {
    expect(component).to.exist;
  });
});
