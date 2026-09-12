import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Form, Button, Spinner, Col, Row } from 'react-bootstrap';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const validateField = (fieldName, value) => {
    if (fieldName === "email") {
      if (!value) setEmailError("O email é obrigatório");
      else if (!/\S+@\S+\.\S+/.test(value)) setEmailError("Email inválido");
      else setEmailError("");
    } else if (fieldName === "password") {
      if (!value) setPasswordError("A senha é obrigatória");
      else setPasswordError("");
    }
  };

  const onSubmit = async e => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    await signIn('credentials', { email, password })
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        setError("Ocorreu um erro. Por favor, verifique suas credenciais e tente novamente.");
        setIsLoading(false);
      });
  }

  return (
    <div className="float-container">
      <h2 className="subtitle"><b>Login</b></h2>
      <h1 className="title">Bem vindo de volta ao Soft Commerce</h1>
      <p className="info-text">Insira suas credenciais para acessar sua conta!</p>
      <Form onSubmit={onSubmit} className="form">
        <Form.Group controlId="inputEmail">
          <Form.Label className="form-label">Email</Form.Label>
          <Form.Control
            type="email"
            onChange={e => { setEmail(e.target.value); validateField('email', e.target.value); }}
            onBlur={e => validateField('email', e.target.value)}
            value={email}
            placeholder="Digite seu email"
            className="form-control"
          />
          {emailError && <div className="error-message">{emailError}</div>}
        </Form.Group>
        <Form.Group controlId="inputPassword">
          <Form.Label className="form-label">Senha</Form.Label>
          <Form.Control
            type="password"
            onChange={e => { setPassword(e.target.value); validateField('password', e.target.value); }}
            onBlur={e => validateField('password', e.target.value)}
            value={password}
            placeholder="Digite sua senha"
            className="form-control"
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </Form.Group>
        <Button type="submit" variant="outline-primary" className="btn-submit" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Entrar'}
        </Button>
      </Form>
      {error && <p className="error-message">{error}</p>}
      <p className="signup-link">Não tem uma conta? <Link href="/signup">Cadastre-se aqui</Link></p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default LoginPage;
