import React, {useState} from 'react';
import LatestPosts from "../latestPosts/LatestPosts";
import Button from 'react-bootstrap/Button';
import AddPostModal from '../addPostModal/AddPostModal';
import MyNavbar from '../navbar/MyNav';
import { navLinks } from '../../data/myNavData';
import MyFooter from '../../comps/footer/MyFooter';

const Main=({appQuery,SetAppQuery})=>{
    const [isModalOpen, setIsModalOpen] = useState(false)

const toggleModal = () => setIsModalOpen(!isModalOpen)

return(
<>
<div>
<MyNavbar appQuery={appQuery} SetAppQuery={SetAppQuery} links={navLinks} />
 <Button className="mb-4"
   onClick={toggleModal}
   variant="primary ms-3 my-3">
   Add Post!
 </Button>
</div>
{isModalOpen && (<AddPostModal close={setIsModalOpen} /> )}
<div>
<LatestPosts appQuery={appQuery} />
</div>
<MyFooter />
</> ) }
export default Main;  