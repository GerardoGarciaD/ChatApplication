import React from "react";
import "./Modal.scss";

const Modal = (props) => {
  // Children es todo contenido que esta dentro del componente Modal, en este caso se mandaron 3 div con un key unico para poderlos mapear y así renderizarlos
  const findByKey = (name) =>
    props.children.map((child) => {
      if (child.key === name) return child;
    });

  return (
    <div className="modal-mask modal-close">
      <div className="modal-wrapper">
        <div className="modal-container">
          <div className="modal-header">{findByKey("header")}</div>
          <div className="modal-body">{findByKey("body")}</div>
          <div className="modal-footer">{findByKey("footer")}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
