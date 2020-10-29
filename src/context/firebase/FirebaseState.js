import React, {useReducer}from 'react'
import axios from 'axios'
import {FirebaseContext} from "./firebaseContext";
import {firebaseReducer} from "./firebaseReducer";
import {ADD_NOTE, FETCH_NOTES, REMOVE_NOTE, SHOW_LOADER, EDIT_NOTE} from "../types";

const url = process.env.REACT_APP_DB_URL

export const FirebaseState = ({children}) =>{
    const initialState = {
        notes:[],
        loading: false
    }
    const [state, dispatch] = useReducer(firebaseReducer, initialState)

    const showLoader = () => dispatch({type:SHOW_LOADER})

    const fetchNotes = async () =>{
        showLoader()
        const res = await axios.get(`${url}/notes.json`)
        const payload = Object.keys(res.data).map(key =>{
            return{
                ...res.data[key],
                id: key
            }
        })

        dispatch({type: FETCH_NOTES, payload})
    }

    const addNote = async (title, body) =>{
        const note = {
            title, body, date: new Date().toJSON()
        }
        try{
            const res = await axios.post(`${url}/notes.json`, note)
            const payload = {
                ...note,
                id:res.data.name
            }
            dispatch({type:ADD_NOTE, payload})
        } catch (e){
            throw new Error(e.message)
        }


    }

    const removeNote = async id => {
        await axios.delete(`${url}/notes/${id}.json`)

        dispatch({
            type: REMOVE_NOTE,
            payload: id
        })
    }
    const editNote = async (id, newTitle, newBody) =>{
        const note = axios.get(`${url}/notes/${id}.json`)
        note.title = newTitle;
        note.body = newBody;
        const res = axios.put(`${url}/notes/${id}.json`, note)

        const payload = {
            ...note,
            id:id
        }
        dispatch({type:EDIT_NOTE, payload})
    }

    return(
        <FirebaseContext.Provider value={{
            showLoader, fetchNotes, addNote, removeNote, editNote,
            loading: state.loading,
            notes:state.notes
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}