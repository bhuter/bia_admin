import React from 'react';
import LoginForm from '@/app/comps/auth/login';

const Login: React.FC = () => {
  return (
    <>
      <head>
        <title>Login - System Admin</title>
      </head>
      {/** login form */}
     <div className='fixed left-0 top-0 flex w-full items-center h-screen justify-center bg-slate-200 z-50'>
      <LoginForm />
     </div>
      
     
    </>
  );
};

export default Login;
