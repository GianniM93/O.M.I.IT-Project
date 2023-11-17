import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const UserEdit = ({gamer}) => {
const [file, setFile] = useState(null)
const [formData, setFormData] = useState()
const onChangeSetFile = (e) => {
    setFile(e.target.files[0]) }
const uploadFile = async (avatar) => {
    const fileData = new FormData()
    fileData.append('avatar', avatar)
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/cloudUpload`, {
            method: "POST",
            body: fileData
        })
        return await response.json()
    } catch (error) {
        console.log(error, 'Errore in uploadFile') } }
        
const onSubmit = async (e) => {
    e.preventDefault()
    
    if (file) {
            const uploadAvatar = await uploadFile(file)
            //console.log(uploadAvatar)
            const finalBody = {
                ...formData,
                avatar: uploadAvatar.avatar }
                const token = JSON.parse(localStorage.getItem('loggedInUser'));
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/update/${gamer}`, {
                headers: {
                    "Content-Type": "application/json",'loggedInUser': token },
                method: 'PATCH',
                body: JSON.stringify(finalBody) })
                const result = await response.json();
                  if (response.ok) {
                      alert(result.message);
                  } else {
                      alert('An error occurred: ' + result.message) }
        

    } else {
        const finalBody = {
            ...formData }
            const token = JSON.parse(localStorage.getItem('loggedInUser'));
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/update/${gamer}`, {
            headers: {
                "Content-Type": "application/json",'loggedInUser': token },
            method: 'PATCH',
            body: JSON.stringify(finalBody) })
            const result = await response.json();
              if (response.ok) {
                  alert(result.message);
             }else {
                  alert('An error occurred: ' + result.message) } }}
    

return (
        <>
  <h1>Edit Your Data!</h1>
    <Form encType="multipart/form-data" onSubmit={onSubmit}>
      
      <Form.Group className="mb-3">
        <Form.Label>FirstName</Form.Label>
        <Form.Control type="text" placeholder="FirstName" name="firstName"
         onChange={(e) => setFormData({
            ...formData,
            firstName: e.target.value
        })}/>
    </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>LastName</Form.Label>
        <Form.Control type="text" placeholder="LastName" name="lastName"
        onChange={(e) => setFormData({
            ...formData,
            lastName: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>NickName</Form.Label>
        <Form.Control type="text" placeholder="NickName" name="nickName"
        onChange={(e) => setFormData({
            ...formData,
            nickName: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>email</Form.Label>
        <Form.Control type="text" placeholder="email" name="email"
        onChange={(e) => setFormData({
            ...formData,
            email: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>BirthDate</Form.Label>
        <Form.Control type="text" placeholder="BirthDate" name="birthDate"
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
        <Form.Control type="text" placeholder="Password" name="password"
         onChange={(e) => setFormData({
            ...formData,
            password:e.target.value
        })}/>
      </Form.Group>

      <Button variant="primary mx-3 mb-3" type="submit">
        UserEdit!
      </Button>
    </Form>
    </>
    ) };

export default UserEdit;

