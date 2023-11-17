import {footerColOne,footerColTwo,footerColThree } from '../../data/myFooterLinks';
import { nanoid } from 'nanoid';
import './footer.css'

const MyFooter=()=>{
    return(
<footer className="social_links">
<span className="socials">Visit these:</span><br />
<table className='footertab'>
<tbody>
    <tr>
    {footerColOne.map((link)=>(
        <th key={nanoid()} >
    <a href={link.href}> {link.label} </a>
        </th>
    ))}
    </tr>
    <tr>
    {footerColTwo.map((link)=>(
        <th key={nanoid()}>
    <a href={link.href}> {link.label} </a>
        </th>
    ))}
    </tr>
    <tr>
    {footerColThree.map((link)=>(
        <th key={nanoid()}>
    <a href={link.href}> {link.label} </a>
        </th>
    ))}
    </tr>
    </tbody>
</table>
<p>© 2023 O.M.I.IT(v.1) by Gianni Mocci</p>
</footer>
    ) }
export default MyFooter;