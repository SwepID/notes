import React, {useContext, useState} from "react";
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import {AlertContext} from "../context/alert/alertContext";
import {FirebaseContext} from "../context/firebase/firebaseContext";


let noteId = null;

export const Notes = ({notes, onRemove}) => {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const alert = useContext(AlertContext)
    const firebase = useContext(FirebaseContext)
    const submitHandler = (event) => {
        event.preventDefault()
        if(title.trim() && noteId != null){
            firebase.editNote(noteId, title.trim(), body.trim()).then(() => {
                alert.show('Заметка была изменена', 'success')
            }).catch(() => {
                alert.show('Что-то пошло не так', 'danger')
            })
            setTitle('')
            setBody('')

        } else {
            alert.show('Введите название заметки')
        }
    }
    const submitHandler2 = (id) => {
        noteId = id;
        const modal = document.getElementById("noteForm2");
        const close = document.querySelectorAll('[data-close="true"]');
        modal.style.display = 'block';
        for (let i = 0; i < close.length; i++) {
            close[i].onclick = function() {
                modal.style.display = 'none';
            }
        }
        window.onclick = function(e){
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
        document.onkeydown = function(e) {
            if (e.key === `Escape`) {
                modal.style.display = 'none';
            }
        };
    }

    return(
        <TransitionGroup component="ul" className="list-group">
            {notes.map(note =>(
                <CSSTransition key={note.id} classNames = {'note'} timeout = {800}>
                    <li className="list-group-item note">
                        <div className="textContent">
                            <strong>{note.title}</strong>
                            <p>{note.body}</p>
                            <small>{note.date}</small>
                        </div>
                        <div className="editAndDelete">
                            <button type="button"
                                    className="btn btn-warning btn-sm deleteBtn"
                                    onClick={() => {submitHandler2(note.id)}}
                            >
                                &#128393;
                            </button>
                            <button type="button"
                                    className="btn btn-danger btn-sm deleteBtn"
                                    onClick={() => {onRemove(note.id)}}
                            >
                                &#9747;
                            </button>
                        </div>
                    </li>

                </CSSTransition>

            ))}
            <div>
                <div id="noteForm2" className="modal">
                    <div className="modalContent modalPrimary">
                        <div className="modalHeader">
                            <span className="modalClose" data-close="true">&times;</span>
                            Редактирование заметки
                        </div>
                        <div className="modalBody">
                            <form onSubmit={{}}>
                                <div className="form-group">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="Введите название заметки"
                                           value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </div>
                            </form>
                            <form onSubmit={{}}>
                                <div className="form-group">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="Введите содержимое заметки"
                                           value={body}
                                        onChange={e => setBody(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modalFooter">
                            <div className="modalFooterContent">
                                <button type="button" className="btn" data-close="true">Закрыть</button>
                                <button type="button" className="btn" data-close="true" onClick={submitHandler}>Сохранить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TransitionGroup>
)

}
