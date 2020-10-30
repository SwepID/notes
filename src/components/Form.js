import React, {useState, useContext} from "react";
import {AlertContext} from "../context/alert/alertContext";
import {FirebaseContext} from "../context/firebase/firebaseContext";


export const Form = () => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const alert = useContext(AlertContext)
    const firebase = useContext(FirebaseContext)
    const submitHandler = event => {
        event.preventDefault()
        if(title.trim()){
            firebase.addNote(title.trim(), body.trim()).then(() => {
                alert.show('Заметка была создана', 'success')
            }).catch(() => {
                alert.show('Что-то пошло не так', 'danger')
            })
            setTitle('')
            setBody('')

        } else {
            alert.show('Введите название заметки')
        }
    }

    const submitHandler2 = () => {
        const modal = document.getElementById("noteForm");
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

    return (
        <div>
            <button className="addNoteButton" type="submit" name="addNote" onClick={submitHandler2}></button>
            <div id="noteForm" className="modal">
                <div className="modalContent modalPrimary">
                    <div className="modalHeader">
                        <span className="modalClose" data-close="true">&times;</span>
                        Создание заметки
                    </div>
                    <div className="modalBody">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <input type="text"
                                       className="form-control"
                                       placeholder="Введите название заметки"
                                       value={title}
                                       onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                        </form>
                        <form onSubmit={submitHandler}>
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

    )
}