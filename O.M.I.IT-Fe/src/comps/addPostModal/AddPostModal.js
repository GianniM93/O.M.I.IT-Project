import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const AddPostModal = ({ close }) => {
    const [file, setFile] = useState(null)
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
      readTime: {
      value: "",
      unit: "" },
    author:{
      name:"",
    avatar:"" } } )
      

      useEffect(() => {
        // Funzione per ottenere i dettagli dell'utente collegato
        const fetchUserData = async () => {
          try {
            const token = JSON.parse(localStorage.getItem('loggedInUser'));
    
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/me`, {
              headers: {'loggedInUser': token },
            });
    
            if (!response.ok) {
              
              throw new Error('Errore nella richiesta');
            }
    
            const userData = await response.json();
            console.log("Dati utente:",userData)

        setUserInfo(userData);   
        setFormData({
          ...formData,
          author: {
            name: `${userData.firstName} ${userData.lastName}`,
            avatar: userData.avatar,
          },
        });
            
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente:', error);
      }
    };

    fetchUserData();
  }, []); // L'array vuoto indica che questa chiamata effettuerà la richiesta solo una volta


    const onChangeSetFile = (e) => {
        setFile(e.target.files[0]) }

    const uploadFile = async (cover) => {
        const fileData = new FormData()
        fileData.append('cover', cover)

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/cloudUpload`, {
                method: "POST",
                body: fileData
            })
            return await response.json()
        } catch (error) {
            console.log(error, 'Errore in uploadFile') } }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!userInfo) {
          console.error('Dati utente non disponibili.');
          return }

        if (file) {  
                const uploadCover = await uploadFile(file)
                console.log(uploadCover)
                const finalBody = {
                    ...formData,
                    cover: uploadCover.cover }  
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${userInfo._id}/add-post`, {
                    headers: {
                        "Content-Type": "application/json" },
                    method: 'POST',
                    body: JSON.stringify(finalBody) })

                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message);
                    } else {
                        alert('An error occurred: ' + result.message) } }
        else{
              const finalBody = {
                ...formData }  
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${userInfo._id}/add-post`, {
                headers: {
                    "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify(finalBody) })

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                } else {
                    alert('An error occurred: ' + result.message) }
              } }

    return (
        <>
  <h1>Make a Post!</h1>
    <Form encType="multipart/form-data" onSubmit={onSubmit}>
      
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control type="text" placeholder="Category" name="category" required
         onChange={(e) => setFormData({
            ...formData,
            category: e.target.value
        })}/>
    </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Title" name="title" required
        onChange={(e) => setFormData({
            ...formData,
            title: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cover</Form.Label>
        <Form.Control type="File" placeholder="Cover" 
        name="cover" onChange={onChangeSetFile} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>ReadTime Value</Form.Label>
        <Form.Control type="number" placeholder="ReadTime Value" name="value" 
         onChange={(e) => setFormData({
          ...formData,
          readTime: {
            ...formData.readTime,
            value: Number(e.target.value)
          }
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>ReadTime Unit</Form.Label>
        <Form.Control type="text" placeholder="ReadTime Unit" name="unit"
        onChange={(e) => setFormData({
          ...formData,
          readTime: {
            ...formData.readTime,
            unit: e.target.value
          }
        })}/>
      </Form.Group>

      

      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control type="text" placeholder="Content" name="content" required
         onChange={(e) => setFormData({
            ...formData,
            content:e.target.value
        })}/>
      </Form.Group>

      <Button variant="primary mx-3 mb-3" type="submit">
        Add Post!
      </Button>
      <Button onClick={() => close(false)}  variant="primary mb-3">
        Close
      </Button>
    </Form>
    </>
    ) };

export default AddPostModal;

