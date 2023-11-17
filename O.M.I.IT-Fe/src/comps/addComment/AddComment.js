import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const AddCommentModal = ({infoId,close,userInfo}) => {
    const [formData, setFormData] = useState({
      commCreator: userInfo?._id,
      commAuthor: `${userInfo?.firstName} ${userInfo?.lastName}`})
      

    const onSubmit = async (e) => {
        e.preventDefault()

            try{
                const finalBody = {
                ...formData }  
              const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${infoId}/add-comment`, {
                headers: {
                    "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify(finalBody) })

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                } else {
                    alert('An error occurred: ' + result.message) }

            }catch (error) {
              console.error('Error:', error);
            } }

    return (
        <>
  
    <Form encType="multipart/form-data" onSubmit={onSubmit}>

      <Form.Group className="mb-3">
        <Form.Label>Comm</Form.Label>
        <Form.Control type="text" placeholder="Comm" name="comm" required
        onChange={(e) => setFormData({
            ...formData,
            comm: e.target.value
        })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Rate</Form.Label>
        <Form.Control type="number" min="1" max="5" placeholder="Rate" name="rate" required
         onChange={(e) => setFormData({
            ...formData,
            rate:e.target.value
        })}/>
      </Form.Group>

      <Button variant="primary mx-3 mb-3" type="submit">
        Post Comment
      </Button>
      <Button onClick={() => close(false)}  variant="primary mb-3">
        Close
      </Button>
    </Form>
    </>
    ) };

export default AddCommentModal;

