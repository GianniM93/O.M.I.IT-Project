import {Container,Row,Col} from 'react-bootstrap'
import {footerColOne,footerColTwo,footerColThree } from '../../data/myFooterLinks';
import { nanoid } from 'nanoid';

const MyFooter=()=>{
    return(
<footer>
<Container>
<Row>
    <Col>
    {footerColOne.map((link)=>(
        <li key={nanoid()}>
    <a href={link.href}> {link.label} </a>
        </li>
    ))}
    </Col>
    <Col>
    {footerColTwo.map((link)=>(
        <li key={nanoid()}>
    <a href={link.href}> {link.label} </a>
        </li>
    ))}
    </Col>
    <Col>
    {footerColThree.map((link)=>(
        <li key={nanoid()}>
    <a href={link.href}> {link.label} </a>
        </li>
    ))}
    </Col>
</Row>
</Container>
</footer>
    ) }
export default MyFooter;