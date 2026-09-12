import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { Form, Button, Spinner, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateField = (fieldName, value) => {
    if (fieldName === "firstName") {
      if (!value) setFirstNameError("O nome é obrigatório");
      else setFirstNameError("");
    } else if (fieldName === "lastName") {
      if (!value) setLastNameError("O sobrenome é obrigatório");
      else setLastNameError("");
    } else if (fieldName === "email") {
      if (!value) setEmailError("O email é obrigatório");
      else if (!/\S+@\S+\.\S+/.test(value)) setEmailError("Email inválido");
      else setEmailError("");
    } else if (fieldName === "password") {
      if (!value) setPasswordError("A senha é obrigatória");
      else setPasswordError("");
    }
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não correspondem");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      const data = await res.json();

      setIsLoading(false);

      if (res.status !== 201) {
        setError(data.message || "Algo deu errado ao criar sua conta. Tente novamente.");
      } else {
        signIn("credentials", { email, password, callbackUrl: "/" });
      }
    } catch (err) {
      setIsLoading(false);
      setError("Algo deu errado ao criar sua conta. Tente novamente.");
    }
  };

  return (
    <div className="float-container">
      <h2 className="subtitle"><b>SignUp</b></h2>
      <h1 className="title">Bem vindo ao Soft Commerce</h1>
      <p className="info-text">Sua primeira vez aqui? Crie sua conta!</p>
      <Form onSubmit={handleSubmit} className="form">
        <Row className="user-name">
          <Form.Group as={Col} controlId="inputFirstName">
            <Form.Label className="form-label">Primeiro Nome</Form.Label>
            <Form.Control
              type="text"
              onChange={e => { setFirstName(e.target.value); validateField('firstName', e.target.value); }}
              onBlur={e => validateField('firstName', e.target.value)}
              value={firstName}
              placeholder="Lucas"
              className="form-control"
            />
            {firstNameError && <div className="error-message">{firstNameError}</div>}
          </Form.Group>
          <Form.Group as={Col} controlId="inputLastName">
            <Form.Label className="form-label">Último Nome</Form.Label>
            <Form.Control
              type="text"
              onChange={e => { setLastName(e.target.value); validateField('lastName', e.target.value); }}
              onBlur={e => validateField('lastName', e.target.value)}
              value={lastName}
              placeholder="Cardoso"
              className="form-control"
            />
            {lastNameError && <div className="error-message">{lastNameError}</div>}
          </Form.Group>
        </Row>
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
        <Form.Group controlId="confirmPassword">
          <Form.Label className="form-label">Confirmar Senha</Form.Label>
          <Form.Control
            type="password"
            onChange={e => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            placeholder="Digite novamente sua senha"
            className="form-control"
          />
          {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
        </Form.Group>
        <Button type="submit" variant="outline-primary" className="btn-submit" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Cadastrar'}
        </Button>
      </Form>
      {error && <p className="error-message">{error}</p>}
      <p className="login-link">Já tem uma conta? <Link href="/login">Acesse aqui</Link></p>
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

export default SignUp;
