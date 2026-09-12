import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Navbar, Nav, Form, FormControl, Button, Carousel, Card, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { BsCartFill, BsPersonFill } from 'react-icons/bs';
import Link from 'next/link';
import CartModal from '../components/CartModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticProps() {
  try {
    const categoriesResponse = await fetch(`${API_URL}/api/categories/`, {
      headers: {
        'x-api-key': process.env.APP_API_KEY,
      },
    });
    const categoriesData = await categoriesResponse.json();
    const categoryIds = categoriesData.map(category => category.id);

    const categoriesWithProducts = [];

    for (const categoryId of categoryIds) {
      const categoryResponse = await fetch(`${API_URL}/api/categories/${categoryId}`, {
        headers: {
          'x-api-key': process.env.APP_API_KEY,
        },
      });
      const categoryData = await categoryResponse.json();
      
      const productIds = categoryData.products.map(product => product.productId);

      const productsData = [];
      for (const productId of productIds) {
        const productResponse = await fetch(`${API_URL}/api/products/${productId}`, {
          headers: {
            'x-api-key': process.env.APP_API_KEY,
          },
        });
        const productData = await productResponse.json();
        productsData.push(productData);
      }
      
      const categoryWithProducts = {
        id: categoryData.id,
        name: categoryData.name,
        products: productsData,
      };

      categoriesWithProducts.push(categoryWithProducts);
    }
    return {
      props: { categoriesWithProducts },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      props: { categoriesWithProducts: [] },
    };
  }
}

const Home = ({ categoriesWithProducts }) => {
  const { data: session } = useSession();
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleShowCartModal = () => {
    setShowCartModal(true);
  };

  const handleAddToCart = (product) => {
    const existingCartItem = cartItems.find((item) => item.id === product.id);

    if (existingCartItem) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1,
            price: item.price,
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      const newCartItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: 1,
      };
      setCartItems((prevCartItems) => [...prevCartItems, newCartItem]);
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, newCartItem]));
    }
  };

  return (
    <div className="homeContainer">
      <Navbar bg="light" variant="light" className="navbar">
        <Navbar.Brand href="#home" className="brand">AgusStore</Navbar.Brand>
        <Form inline className="search-engine">
          <FormControl type="text" placeholder="Buscar productos..." className="mr-sm-2" />
          <Button variant="outline-primary" className="searchButton">Buscar</Button>
        </Form>
        
        <Nav className="ml-auto">
          <Nav.Link onClick={handleShowCartModal}>
            <BsCartFill />
          </Nav.Link>

          {session ? (
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link}>
                <BsPersonFill />
              </Dropdown.Toggle>

              <Dropdown.Menu align="right">
                <Dropdown.Item href="/user">Perfil</Dropdown.Item>
                <Dropdown.Item href="#">Configuración</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => signOut()}>Salir</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link href="/login">Ingresar</Nav.Link>
          )}
        </Nav>
      </Navbar>

      <Carousel className="carousel">
        <Carousel.Item>
          <img
            className="d-block w-100 carouselImage"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            alt="Nueva Colección Tecnológica"
          />
          <Carousel.Caption className="carouselCaption">
            <h3>Innovación y Estilo</h3>
            <p>Descubre los lanzamientos destacados de la temporada</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carouselImage"
            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80"
            alt="Ofertas Especiales"
          />
          <Carousel.Caption className="carouselCaption">
            <h3>Envíos a todo el país</h3>
            <p>Compra segura con integración de pagos automatizada</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {categoriesWithProducts.map((category) => (
        <Container key={category.id} className="categoryContainer">
          <h1 className="categoryTitle">{category.name}</h1>
          <Row className='line-card'>
            {category.products.map((product) => (
              <Col sm={4} key={product.id} className="productCol">
                <Card className="productCard">
                  <Card.Img variant="top" src={product.imageUrl} className="productImage" />
                  <Card.Body className="card-body">
                    <Link href={`/product/${product.id}`} className='link-card'>
                      <Card.Title className="productTitle">
                        {product.title.length > 30 ? `${product.title.slice(0, 30)}...` : product.title}
                      </Card.Title>
                      <Card.Text className="productDescription">
                        {product.description.length > 25 ? `${product.description.slice(0, 25)}...` : product.description}
                      </Card.Text>
                    </Link>
                    <div className='footer-card'>
                      <Card.Title className="product-price">
                        <b>${product.price ? product.price.toFixed(2) : '0.00'}</b>
                      </Card.Title>
                      <Button variant='outline-primary' onClick={() => handleAddToCart(product)}>
                        Agregar <BsCartFill style={{ marginRight: '5px' }} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      ))}

      {showCartModal && (
        <CartModal
          show={showCartModal}
          cartItems={cartItems}
          totalPrice={0}
          onHide={() => setShowCartModal(false)}
        />
      )}
    </div>
  );
};

export default Home;