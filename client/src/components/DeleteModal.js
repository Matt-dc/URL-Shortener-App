import React from 'react'
import { Modal, Button } from 'react-bootstrap' 


export default function DeleteModal(props) {
    return (
        <Modal show={props.showDeleteModal} onHide={props.hideDeleteModal} >
            <Modal.Header closeButton>
                <Modal.Title>Delete URL</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{props.showDeleteModal}</p>
                <p>Are you sure you want to permanently delete this url from the database?</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.hideDeleteModal}>Cancel</Button>
                <Button variant="danger" onClick={() => props.confirmDeleteUrl(props.showDeleteModal)}>Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}
