import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useNavigate} from "react-router-dom";


const SignUp = () => {
const [file, setFile] = useState(null)
const [formData, setFormData] = useState()
const navigate = useNavigate()
const onChangeSetFile = (e) => {
    setFile(e.target.files[0]) }
const uploadFile = async (avatar) => {
    const fileData = new FormData()
    fileData.append('avatar', avatar)
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors/cloudUpload`, {
            method: "POST",
            body: fileData
        })
        return await response.json()
    } catch (error) {
        console.log(error, 'Errore in uploadFile') } }
        
const onSubmit = async (e) => {
    e.preventDefault()
    
    if (file) {
        try {
            const uploadAvatar = await uploadFile(file)
            console.log(uploadAvatar)
            const finalBody = {
                ...formData,
                avatar: uploadAvatar.avatar }
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors/create`, {
                headers: {
                    "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify(finalBody) })
                if (response.ok) {
                    navigate('/')
                } else {
                    console.error("Errore nella richiesta POST.")}
        } catch(error) {
            console.log(error) }

    } else {
      try {
        const finalBody = {
            ...formData }
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors/create`, {
            headers: {
                "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(finalBody) })
            if (response.ok) {
                navigate('/')
            } else {
                console.error("Errore nella richiesta POST.")}
    } catch(error) {
        console.log(error) } } }

return (
        <>
  <h1>Wanna Post?</h1>
    <Form encType="multipart/form-data" onSubmit={onSubmit}>
      
      <Form.Group className="mb-3">
        <Form.Label>FirstName</Form.Label>
        <Form.Control type="text" placeholder="FirstName" name="firstName" required
         onChange={(e) => setFormData({
            ...formData,
            firstName: e.target.value
        })}/>
    </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>LastName</Form.Label>
        <Form.Control type="text" placeholder="LastName" name="lastName" required
        onChange={(e) => setFormData({
            ...formData,
            lastName: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>email</Form.Label>
        <Form.Control type="text" placeholder="email" name="email" required
        onChange={(e) => setFormData({
            ...formData,
            email: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>BirthDate</Form.Label>
        <Form.Control type="text" placeholder="BirthDate" name="birthDate" required
        onChange={(e) => setFormData({
            ...formData,
            birthDate: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Avatar</Form.Label>
        <Form.Control type="File" placeholder="Avatar" 
        name="avatar" onChange={onChangeSetFile} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="text" placeholder="Password" name="password" required
         onChange={(e) => setFormData({
            ...formData,
            password:e.target.value
        })}/>
      </Form.Group>

      <Button variant="primary mx-3 mb-3" type="submit">
        Signup!
      </Button>
    </Form>
    </>
    ) };

export default SignUp;

