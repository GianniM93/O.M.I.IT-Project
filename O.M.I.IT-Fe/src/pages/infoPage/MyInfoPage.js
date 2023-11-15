import MyNavbar from '../../comps/navbar/MyNav';
import { navLinks } from '../../data/myNavData';
import R7Xlogo from '../../Raito R7XMark.jpg';
import SnMlogo from '../../SnM Logo.jpg';

const InfoPage=()=>{
    return (
    <>
    <MyNavbar className="mb-4"  links={navLinks} />
    <p>Questa è una pagina di info extra da aggiornare in seguito...</p>
    <img src={R7Xlogo} alt="R7Xlogo" />
    <img src={SnMlogo} alt="SnMlogo" />
    </>
    )}

export default InfoPage;