import { create, props } from '@stylexjs/stylex';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
const LOGIN_STYLES = create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  button: {
    display: 'flex',
    gap: '.5rem',
    alignItems: 'center',
    fontSize: '2rem',
    textTransform: 'uppercase',
  },
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const onLogin = () => {
    loginWithGoogle().then(() => {
      navigate('/employees-edit');
    });
  };

  return (
    <main {...props(LOGIN_STYLES.container)}>
      <button onClick={onLogin}>
        <div {...props(LOGIN_STYLES.button)}>
        bejelentkezés
        </div>

      </button>
    </main>
  );
};

export default Login;