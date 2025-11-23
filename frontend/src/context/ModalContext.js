import React, { useState, useContext, useCallback } from "react";

export const MODAL_TYPES = {
  LOGIN_MODAL: "LOGIN_MODAL",
  REGISTER_MODAL: "REGISTER_MODAL",
  ALERT_MODAL: "ALERT_MODAL",
  ORDER_TRACKING_MODAL: "ORDER_TRACKING_MODAL",
};

const ModalContext = React.createContext({
  isOpen: false,
  modalType: null,
  modalProps: {},
  openModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const openModal = useCallback((type, props = {}) => {
    setModalType(type);
    setModalProps(props);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
    setModalProps({});
  }, []);

  return (
    <ModalContext.Provider
      value={{ isOpen, modalType, modalProps, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};