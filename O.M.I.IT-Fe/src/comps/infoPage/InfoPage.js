import MyNavbar from '../navbar/MyNav';
import { navLinks } from '../../data/myNavData';

const InfoPage=()=>{
    return (
    <>
    <MyNavbar className="mb-4"  links={navLinks} />
    <p>Questa è una pagina di info extra da aggiornare in seguito...</p>
    </>
    )}

export default InfoPage;