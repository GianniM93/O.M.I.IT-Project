import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const AddNewGame = ({userInfo,close}) => {
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({collCreator: userInfo?._id})
      
    const onChangeSetFile = (e) => {
        setFile(e.target.files[0]) }

    const uploadFile = async (gameCover) => {
        const fileData = new FormData()
        fileData.append('gameCover', gameCover)

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/collections/cloudUpload`, {
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
                    gameCover: uploadCover.gameCover }  
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${userInfo._id}/add-collection`, {
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
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${userInfo._id}/add-collection`, {
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
  <h1>New Game!</h1>
    <Form encType="multipart/form-data" onSubmit={onSubmit}>
      
      <Form.Group className="mb-3">
        <Form.Label>gameTitle</Form.Label>
        <Form.Control type="text" placeholder="gameTitle" name="gameTitle" required
         onChange={(e) => setFormData({
            ...formData,
            gameTitle: e.target.value
        })}/>
    </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>developer</Form.Label>
        <Form.Control type="text" placeholder="developer" name="developer" required
        onChange={(e) => setFormData({
            ...formData,
            developer: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>gameCover</Form.Label>
        <Form.Control type="File" placeholder="gameCover" 
        name="gameCover" onChange={onChangeSetFile} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>publisher</Form.Label>
        <Form.Control type="text" placeholder="publisher" name="publisher" required
        onChange={(e) => setFormData({
            ...formData,
            publisher: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>genres</Form.Label>
        <Form.Control type="text" placeholder="genres" name="genres" required
        onChange={(e) => setFormData({
            ...formData,
            genres: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>releaseDate</Form.Label>
        <Form.Control type="text" placeholder="releaseDate" name="releaseDate" required
         onChange={(e) => setFormData({
            ...formData,
            releaseDate:e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>platforms</Form.Label>
        <Form.Control type="text" placeholder="platforms" name="platforms" required
        onChange={(e) => setFormData({
            ...formData,
            platforms: e.target.value
        })}/>
      </Form.Group>

      <Button variant="primary mx-3 mb-3" type="submit">
        Add Game!
      </Button>
      <Button onClick={() => close(false)}  variant="primary mb-3">
        Close
      </Button>
    </Form>
    </>
    ) };

export default AddNewGame;

