import { Link } from 'react-router-dom';
import Login from '@/pages/Login';

export default function ApplicantLogin() {
  return (
    <div>
      <Login redirectTo="/applicant/dashboard" signupLink="/applicant/signup" title="Applicant Login" />
      <p className="pb-6 text-center text-sm text-muted-foreground">
        New applicant? <Link to="/applicant/signup" className="text-primary hover:underline">Create account</Link>
      </p>
    </div>
  );
}
