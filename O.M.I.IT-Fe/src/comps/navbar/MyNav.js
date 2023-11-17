
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { nanoid } from "nanoid";

const MyNavbar = ({ links, appQuery, SetAppQuery }) => {
  const handleSearchChange = (event) => {
    SetAppQuery(event.target.value) };

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-5">
      <Container>
        <Navbar.Brand>Welcome!</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {links.map((link) => (
              <Nav.Link key={nanoid()} href={link.href}>
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
          <Nav>
            <input
              type="text"
              placeholder="Search by Title"
              value={appQuery} 
              onChange={handleSearchChange} />
          </Nav> 
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ) };

export default MyNavbar;
