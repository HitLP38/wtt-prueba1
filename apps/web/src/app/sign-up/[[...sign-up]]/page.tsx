import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignUp 
        routing="path" 
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/admin/dashboard"
      />
    </div>
  );
}

