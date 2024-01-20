import RegisterForm from '@/components/session/register-form';
import { Link } from '@nextui-org/react';

function RegisterPage() {
  return (
    <div className="flex">
      <div
        className="hidden sm:block sm:w-3/4 bg-cover bg-center "
        style={{ backgroundImage: 'url(https://source.unsplash.com/random)' }}
      />
      <div className="w-full sm:w-1/2 p-8">
        <div className="flex flex-col justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <RegisterForm />
            <div className="flex justify-between mt-4 text-sm text-blue-500">
              <Link isBlock href="/login">
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
