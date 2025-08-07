import { generateNonce } from '@/shared';
import LoginContainer from './__container';
import { login, signup } from './actions';

export default async function LoginPage() {
  const [nonce, hashedNonce] = await generateNonce();

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

      <LoginContainer nonce={nonce} hashedNonce={hashedNonce} />
    </>
  );
}
