import React from "react";
import "./Modal.scss";

const Modal = (props) => {
  // Children es todo contenido que esta dentro del componente Modal, en este caso se mandaron 3 div con un key unico para poderlos mapear y así renderizarlos
  const findByKey = (name) =>
    props.children.map((child) => {
      if (child.key === name) return child;
    });

  const closeModal = (e) => {
    //   Esto evita la propagacion del evento dropdown dejando a este componente aislado (js bubbling and capturing)
    e.stopPropagation();
    if (e.target.classList.contains("modal-close")) {
      // Esta funcion es la que se manda como propiedad desde el componente Navbar
      return props.click();
    }
  };

  return (
    <div className="modal-mask modal-close" onClick={closeModal}>
      <div className="modal-wrapper">
        <div className="modal-container">
          <div className="modal-header">{findByKey("header")}</div>
          <div className="modal-body">{findByKey("body")}</div>
          <div className="modal-footer">
            <button className="modal-close" onClick={closeModal}>
              CLOSE
            </button>
            {findByKey("footer")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
