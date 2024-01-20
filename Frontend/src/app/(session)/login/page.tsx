import LoginForm from '@/components/session/signin-form';
import { Link } from '@nextui-org/react';

function LoginPage() {
  return (
    <div className="flex h-screen">
      <div
        className="hidden sm:block sm:w-3/4 bg-cover bg-center w-3/5"
        style={{ backgroundImage: 'url(https://source.unsplash.com/random)' }}
      />
      <div className="w-full sm:w-1/2 p-8">
        <div className="flex flex-col justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign in</h1>
            <LoginForm />
            <div className="flex justify-between mt-4 text-sm text-blue-500">
              <Link isBlock href="/forgot-password">
                Forgot password?
              </Link>
              <Link isBlock href="/register">
                Don't have an account? Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
