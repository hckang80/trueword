import Script from 'next/script';
import LoginContainer from './__container';
import { login, signup } from './actions';

export default async function LoginPage() {
  return (
    <>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>

      <LoginContainer />

      <Script src="https://accounts.google.com/gsi/client" async defer />
    </>
  );
}
