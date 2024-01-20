import ForgotPasswordForm from '@/components/session/forgot-form';
import { Link } from '@nextui-org/react';

function ForgotPasswordPage() {
  return (
    <div className="flex h-screen">
      <div
        className="hidden sm:block sm:w-3/4 bg-cover bg-center w-3/5"
        style={{ backgroundImage: 'url(https://source.unsplash.com/random)' }}
      />
      <div className="w-full sm:w-1/2 p-8">
        <div className="flex flex-col justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <ForgotPasswordForm />
            <div className="mt-4 text-sm text-blue-500">
              <Link isBlock href="/login">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
