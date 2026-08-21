import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/ParticleHero', () => () => (
  <section><h1>A Cloud Engineer</h1></section>
));

test('renders home page', () => {
  render(<App />);
  const linkElement = screen.getByText(/A Cloud Engineer/i);
  expect(linkElement).toBeInTheDocument();
});
