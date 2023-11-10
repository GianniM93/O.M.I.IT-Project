import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';


const Login = () => {
    const [loginData, setLoginData] = useState({})
    const [login, setLogin] = useState(null)
    

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setLoginData({
            ...loginData,
            [name]:value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/login`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(loginData)
            })
            const data = await response.json()

            if (data.token) {
                localStorage.setItem('loggedInUser', JSON.stringify(data.token))
                navigate('/home') }
            
            setLogin(data)
            alert(login.message)
            console.log(login.message)
        } catch (error) {
            console.log(error);
        } }

  const redirectForLoginWithGithub = () => {
  window.location.href = `${process.env.REACT_APP_SERVER_BASE_URL}/auth/github`}

    return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
    <h1>Wanna Post?</h1>
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleInputChange} required />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
      </Form.Group>
      <Button className="mb-3" variant="primary" type="submit">
        Login
      </Button>
      <p>Or</p>
      <Button className="mb-3" onClick={()=>redirectForLoginWithGithub()} variant="primary">
        Login with Github
      </Button>   

      <h2>NoT RegistereD YeT?</h2>
      <Button onClick={()=>navigate('/signUp')} variant="primary">
        SignUp
      </Button>
    </Form>
    </Col>
      </Row>
    </Container>
    ) };

export default Login;