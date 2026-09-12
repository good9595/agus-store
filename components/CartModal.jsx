import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, ListGroupItem, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const CartModal = ({ onHide }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem('cartItems')) || []);
  }, []);

  const handleQuantityChange = (id, quantity) => {
    let updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: parseInt(quantity) } : item
    );
    updatedCartItems = updatedCartItems.filter(item => item.quantity > 0);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleRemoveItem = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Modal show={true} onHide={onHide} className="cart-modal">
      <Modal.Header closeButton className="cart-modal-header">
        <Modal.Title className="cart-modal-title">Carrinho</Modal.Title>
      </Modal.Header>
      <Modal.Body className="cart-modal-body">
        {cartItems.length === 0 ? (
          <p className="cart-empty">O carrinho está vazio.</p>
        ) : (
          <>
            <Row className="cart-modal-labels">
              <Col><strong>Nome</strong></Col>
              <Col><strong>Preço</strong></Col>
              <Col><strong>Quantidade</strong></Col>
              <Col><strong>Total</strong></Col>
              <Col></Col>
            </Row>
            <ListGroup className="cart-modal-items">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="cart-modal-item">
                  <Row className="cart-modal-item-details">
                    <Col className="cart-item-name">{item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}</Col>
                    <Col className="cart-item-price">R${item.price.toFixed(2)}</Col>
                    <Col className="cart-item-quantity">
                      <ButtonGroup className="bt-lpgroup">
                        <Button variant="outline-primary" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button>
                        <Button variant="outline-secondary" disabled>{item.quantity}</Button>
                        <Button variant="outline-primary" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>
                      </ButtonGroup>
                    </Col>
                    <Col className="cart-item-total">R${(item.price * item.quantity).toFixed(2)}</Col>
                    <Col className="cart-item-remove">
                      <Button variant="outline-danger" onClick={() => handleRemoveItem(item.id)}>
                        <Trash/>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="cart-modal-footer">
        <p className="cart-total">Total: R${totalPrice.toFixed(2)}</p>
        <Button variant="secondary" onClick={onHide} className="cart-close-button">
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
